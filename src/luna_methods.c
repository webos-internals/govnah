/*=============================================================================
 Copyright (C) 2010 WebOS Internals <support@webos-internals.org>

 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU General Public License
 as published by the Free Software Foundation; either version 2
 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program; if not, write to the Free Software
 Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 =============================================================================*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include "luna_service.h"
#include "luna_methods.h"

#define ALLOWED_CHARS "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-"

//
// We use static buffers instead of continually allocating and deallocating stuff,
// since we're a long-running service, and do not want to leak anything.
//
static char buffer[MAXBUFLEN];
static char esc_buffer[MAXBUFLEN];
static char run_command_buffer[MAXBUFLEN];
static char read_file_buffer[CHUNKSIZE+CHUNKSIZE+1];

//
// Escape a string so that it can be used directly in a JSON response.
// In general, this means escaping quotes, backslashes and control chars.
// It uses the static esc_buffer, which must be twice as large as the
// largest string this routine can handle.
//
static char *json_escape_str(char *str)
{
  const char *json_hex_chars = "0123456789abcdef";

  // Initialise the output buffer
  strcpy(esc_buffer, "");

  // Check the constraints on the input string
  if (strlen(str) > MAXBUFLEN) return (char *)esc_buffer;

  // Initialise the pointers used to step through the input and output.
  char *resultsPt = (char *)esc_buffer;
  int pos = 0, start_offset = 0;

  // Traverse the input, copying to the output in the largest chunks
  // possible, escaping characters as we go.
  unsigned char c;
  do {
    c = str[pos];
    switch (c) {
    case '\0':
      // Terminate the copying
      break;
    case '\b':
    case '\n':
    case '\r':
    case '\t':
    case '"':
    case '\\': {
      // Copy the chunk before the character which must be escaped
      if (pos - start_offset > 0) {
	memcpy(resultsPt, str + start_offset, pos - start_offset);
	resultsPt += pos - start_offset;
      };
      
      // Escape the character
      if      (c == '\b') {memcpy(resultsPt, "\\b",  2); resultsPt += 2;} 
      else if (c == '\n') {memcpy(resultsPt, "\\n",  2); resultsPt += 2;} 
      else if (c == '\r') {memcpy(resultsPt, "\\r",  2); resultsPt += 2;} 
      else if (c == '\t') {memcpy(resultsPt, "\\t",  2); resultsPt += 2;} 
      else if (c == '"')  {memcpy(resultsPt, "\\\"", 2); resultsPt += 2;} 
      else if (c == '\\') {memcpy(resultsPt, "\\\\", 2); resultsPt += 2;} 

      // Reset the start of the next chunk
      start_offset = ++pos;
      break;
    }

    default:
      
      // Check for "special" characters
      if ((c < ' ') || (c > 127)) {

	// Copy the chunk before the character which must be escaped
	if (pos - start_offset > 0) {
	  memcpy(resultsPt, str + start_offset, pos - start_offset);
	  resultsPt += pos - start_offset;
	}

	// Insert a normalised representation
	sprintf(resultsPt, "\\u00%c%c",
		json_hex_chars[c >> 4],
		json_hex_chars[c & 0xf]);

	// Reset the start of the next chunk
	start_offset = ++pos;
      }
      else {
	// Just move along the source string, without copying
	pos++;
      }
    }
  } while (c);

  // Copy the final chunk, if required
  if (pos - start_offset > 0) {
    memcpy(resultsPt, str + start_offset, pos - start_offset);
    resultsPt += pos - start_offset;
  } 

  // Terminate the output buffer ...
  memcpy(resultsPt, "\0", 1);

  // and return a pointer to it.
  return (char *)esc_buffer;
}

//
// A dummy method, useful for unimplemented functions or as a status function.
// Called directly from webOS, and returns directly to webOS.
//
bool dummy_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  LSError lserror;
  LSErrorInit(&lserror);

  if (!LSMessageReply(lshandle, message, "{\"returnValue\": true}", &lserror)) goto error;

  return true;
 error:
  LSErrorPrint(&lserror, stderr);
  LSErrorFree(&lserror);
 end:
  return false;
}

//
// Run a shell command, and return the output in-line in a buffer for returning to webOS.
// If lshandle, message and subscriber are defined, then also send back status messages.
// The global run_command_buffer must be initialised before calling this function.
// The return value says whether the command executed successfully or not.
//
static bool run_command(char *command, bool escape) {
  LSError lserror;
  LSErrorInit(&lserror);

  // Local buffers to store the current and previous lines.
  char line[MAXLINLEN];

  fprintf(stderr, "Running command %s\n", command);

  // run_command_buffer is assumed to be initialised, ready for strcat to append.

  // Is this the first line of output?
  bool first = true;

  bool array = false;

  // Start execution of the command, and read the output.
  FILE *fp = popen(command, "r");

  // Return immediately if we cannot even start the command.
  if (!fp) {
    return false;
  }

  // Loop through the output lines
  while (fgets(line, sizeof line, fp)) {

    // Chomp the newline
    char *nl = strchr(line,'\n'); if (nl) *nl = 0;

    // Add formatting breaks between lines
    if (first) {
      if (run_command_buffer[strlen(run_command_buffer)-1] == '[') {
	array = true;
      }
      first = false;
    }
    else {
      if (array) {
	strcat(run_command_buffer, ", ");
      }
      else {
	strcat(run_command_buffer, "<br>");
      }
    }
    
    // Append the unfiltered output to the run_command_buffer.
    if (escape) {
      if (array) {
	strcat(run_command_buffer, "\"");
      }
      strcat(run_command_buffer, json_escape_str(line));
      if (array) {
	strcat(run_command_buffer, "\"");
      }
    }
    else {
      strcat(run_command_buffer, line);
    }
  }
  
  // Check the close status of the process
  if (pclose(fp)) {
    return false;
  }

  return true;
 error:
  LSErrorPrint(&lserror, stderr);
  LSErrorFree(&lserror);
 end:
  // %%% We need a way to distinguish command failures from LSMessage failures %%%
  // %%% This may need to be true if we just want to ignore LSMessage failures %%%
  return false;
}

//
// Send a standard format command failure message back to webOS.
// The command will be escaped.  The output argument should be a JSON array and is not escaped.
// The additional text  will not be escaped.
// The return value is from the LSMessageReply call, not related to the command execution.
//
static bool report_command_failure(LSHandle* lshandle, LSMessage *message, char *command, char *stdErrText, char *additional) {
  LSError lserror;
  LSErrorInit(&lserror);

  // Include the command that was executed, in escaped form.
  snprintf(buffer, MAXBUFLEN,
	   "{\"errorText\": \"Unable to run command: %s\"",
	   json_escape_str(command));

  // Include any stderr fields from the command.
  if (stdErrText) {
    strcat(buffer, ", \"stdErr\": ");
    strcat(buffer, stdErrText);
  }

  // Report that an error occurred.
  strcat(buffer, ", \"returnValue\": false, \"errorCode\": -1");

  // Add any additional JSON fields.
  if (additional) {
    strcat(buffer, ", ");
    strcat(buffer, additional);
  }

  // Terminate the JSON reply message ...
  strcat(buffer, "}");

  fprintf(stderr, "Message is %s\n", buffer);

  // and send it.
  if (!LSMessageReply(lshandle, message, buffer, &lserror)) goto error;

  return true;
 error:
  LSErrorPrint(&lserror, stderr);
  LSErrorFree(&lserror);
 end:
  return false;
}

//
// Run a simple shell command, and return the output to webOS.
//
static bool simple_command(LSHandle* lshandle, LSMessage *message, char *command) {
  LSError lserror;
  LSErrorInit(&lserror);

  // Initialise the output buffer
  strcpy(run_command_buffer, "{\"stdOut\": [");

  // Run the command
  if (run_command(command, true)) {

    // Finalise the message ...
    strcat(run_command_buffer, "], \"returnValue\": true}");

    fprintf(stderr, "Message is %s\n", run_command_buffer);

    // and send it to webOS.
    if (!LSMessageReply(lshandle, message, run_command_buffer, &lserror)) goto error;
  }
  else {

    // Finalise the command output ...
    strcat(run_command_buffer, "]");

    // and use it in a failure report message.
    if (!report_command_failure(lshandle, message, command, run_command_buffer+11, NULL)) goto end;
  }

  return true;
 error:
  LSErrorPrint(&lserror, stderr);
  LSErrorFree(&lserror);
 end:
  return false;
}

//
// Read /proc/cpuinfo
//
bool get_proc_cpuinfo_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message, "/bin/cat /proc/cpuinfo 2>&1");
}

//
// Read /proc/cpuinfo
//
bool get_omap34xx_temp_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message, "/bin/cat /sys/devices/platform/omap34xx_temp/temp1_input 2>&1");
}

//
// Read scaling_available_governors
//
bool get_scaling_available_governors_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message,
			"/bin/cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_available_governors 2>&1");
}

//
// Read scaling_available_frequencies
//
bool get_scaling_available_frequencies_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message,
			"/bin/cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_available_frequencies 2>&1");
}

//
// Read scaling_available_governors
//
bool get_scaling_governor_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message,
			"/bin/cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor 2>&1");
}

//
// Read scaling_max_freq
//
bool get_scaling_max_freq_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message,
			"/bin/cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_max_freq 2>&1");
}

//
// Read scaling_min_freq
//
bool get_scaling_min_freq_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message,
			"/bin/cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_min_freq 2>&1");
}

//
// Read scaling_cur_freq
//
bool get_scaling_cur_freq_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message,
			"/bin/cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq 2>&1");
}

//
// Read scaling_cur_freq
//
bool get_scaling_setspeed_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message,
			"/bin/cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_setspeed 2>&1");
}

//
// Read time_in_state
//
bool get_time_in_state_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message,
			"/bin/cat /sys/devices/system/cpu/cpu0/cpufreq/stats/time_in_state 2>&1");
}

//
// Read total_trans
//
bool get_total_trans_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message,
			"/bin/cat /sys/devices/system/cpu/cpu0/cpufreq/stats/total_trans 2>&1");
}

//
// Read trans_table
//
bool get_trans_table_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message,
			"/bin/cat /sys/devices/system/cpu/cpu0/cpufreq/stats/trans_table 2>&1");
}

//
// Read ignore_nice_load
//
bool get_ignore_nice_load_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message,
			"/bin/cat /sys/devices/system/cpu/cpu0/cpufreq/stats/ignore_nice_load 2>&1");
}

//
// Read powersave_bias
//
bool get_powersave_bias_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message,
			"/bin/cat /sys/devices/system/cpu/cpu0/cpufreq/stats/powersave_bias 2>&1");
}

//
// Read sampling_rate
//
bool get_sampling_rate_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message,
			"/bin/cat /sys/devices/system/cpu/cpu0/cpufreq/stats/sampling_rate 2>&1");
}

//
// Read sampling_rate_min
//
bool get_sampling_rate_min_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message,
			"/bin/cat /sys/devices/system/cpu/cpu0/cpufreq/stats/sampling_rate_min 2>&1");
}

//
// Read sampling_rate_max
//
bool get_sampling_rate_max_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message,
			"/bin/cat /sys/devices/system/cpu/cpu0/cpufreq/stats/sampling_rate_max 2>&1");
}

//
// Read up_threshold
//
bool get_up_threshold_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message,
			"/bin/cat /sys/devices/system/cpu/cpu0/cpufreq/stats/up_threshold 2>&1");
}

//
// Read down_threshold
//
bool get_down_threshold_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message,
			"/bin/cat /sys/devices/system/cpu/cpu0/cpufreq/stats/down_threshold 2>&1");
}

//
// Read freq_step
//
bool get_freq_step_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message,
			"/bin/cat /sys/devices/system/cpu/cpu0/cpufreq/stats/freq_step 2>&1");
}

//
// Read sampling_down_factor
//
bool get_sampling_down_factor_method(LSHandle* lshandle, LSMessage *message, void *ctx) {
  return simple_command(lshandle, message,
			"/bin/cat /sys/devices/system/cpu/cpu0/cpufreq/stats/sampling_down_factor 2>&1");
}

LSMethod luna_methods[] = {
  { "status",					dummy_method },
  { "get_proc_cpuinfo",				get_proc_cpuinfo_method },
  { "get_omap34xx_temp",			get_omap34xx_temp_method },
  { "get_scaling_available_governors",		get_scaling_available_governors_method },
  { "get_scaling_available_frequencies",	get_scaling_available_frequencies_method },
  { "get_scaling_governor",			get_scaling_governor_method },
  { "set_scaling_governor",			dummy_method },
  { "get_scaling_max_freq",			get_scaling_max_freq_method },
  { "set_scaling_max_freq",			dummy_method },
  { "get_scaling_min_freq",			get_scaling_min_freq_method },
  { "set_scaling_min_freq",			dummy_method },
  { "get_scaling_cur_freq",			get_scaling_cur_freq_method },
  { "set_scaling_cur_freq",			dummy_method },
  { "get_scaling_setspeed",			get_scaling_setspeed_method },
  { "set_scaling_setspeed",			dummy_method },
  { "get_time_in_state",			get_time_in_state_method },
  { "get_total_trans",				get_total_trans_method },
  { "get_trans_table",				get_trans_table_method },
  { "get_ignore_nice_load",			get_ignore_nice_load_method },
  { "set_ignore_nice_load",			dummy_method },
  { "get_powersave_bias",			get_powersave_bias_method },
  { "set_powersave_bias",			dummy_method },
  { "get_sampling_rate",			get_sampling_rate_method },
  { "set_sampling_rate",			dummy_method },
  { "get_sampling_rate_max",			get_sampling_rate_max_method },
  { "get_sampling_rate_min",			get_sampling_rate_min_method },
  { "get_up_threshold",				get_up_threshold_method },
  { "set_up_threshold",				dummy_method },
  { "get_down_threshold",			get_down_threshold_method },
  { "set_down_threshold",			dummy_method },
  { "get_freq_step",				get_freq_step_method },
  { "set_freq_step",				dummy_method },
  { "get_sampling_down_factor",			get_sampling_down_factor_method },
  { "set_sampling_down_factor",			dummy_method },
  { 0, 0 }
};

bool register_methods(LSPalmService *serviceHandle, LSError lserror) {
  return LSPalmServiceRegisterCategory(serviceHandle, "/", luna_methods,
				       NULL, NULL, NULL, &lserror);
}
