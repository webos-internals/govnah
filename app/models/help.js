function helpData()
{
}

helpData.get = function(lookup)
{
	if (helpData.lookup[lookup])
	{
		return helpData.lookup[lookup];
	}
	else
	{
		return { title: lookup.replace(/_/g, " ").replace(/-/g, " "), data: 'This section isn\'t configured in the help model. Call a programmer!' };
	}
	return false; // this shouldn't happen
}

helpData.lookup = 
{
	'governor':						{ title: $L('Governor'),				data: 'This section has no help yet - you can contribute some!' },
	'scheduler':					{ title: $L('I/O Scheduler'),			data: 'This section has no help yet - you can contribute some!' },
	'congestion':					{ title: $L('TCP Congestion'),			data: 'This section has no help yet - you can contribute some!' },
	
	'scaling_min_freq':				{ title: $L('Min Frequency'),			data: 'This section has no help yet - you can contribute some!' },
	'scaling_max_freq':				{ title: $L('Max Frequency'),			data: 'This section has no help yet - you can contribute some!' },
	'scaling_setspeed':				{ title: $L('SetSpeed'),				data: 'This section has no help yet - you can contribute some!' },
	'up_threshold':					{ title: $L('Up Threshold'),			data: 'This section has no help yet - you can contribute some!' },
	'down_threshold':				{ title: $L('Down Threshold'),			data: 'This section has no help yet - you can contribute some!' },
	'freq_step':					{ title: $L('Frequency Step'),			data: 'This section has no help yet - you can contribute some!' },
	'sampling_rate':				{ title: $L('Sampling Rate'),			data: 'This section has no help yet - you can contribute some!' },
	'sampling_down_factor':			{ title: $L('Sampling Down Factor'),	data: 'This section has no help yet - you can contribute some!' },
	'powersave_bias':				{ title: $L('Powersave Bias'),			data: 'This section has no help yet - you can contribute some!' },
	'ignore_nice_load':				{ title: $L('Ignore Nice Load'),		data: 'This section has no help yet - you can contribute some!' },
	'max_tickle_window':			{ title: $L('Max Tickle Window'),		data: 'This section has no help yet - you can contribute some!' },
	'max_floor_window':				{ title: $L('Max Floor Window'),		data: 'This section has no help yet - you can contribute some!' },
	'compcache_enabled':			{ title: $L('Compcache Enabled'),		data: 'This section has no help yet - you can contribute some!' },
	'compcache_memlimit':			{ title: $L('Compcache Memlimit'),		data: 'This section has no help yet - you can contribute some!' },
	'vdd1_vsel':					{ title: $L('Core Voltages'),			data: 'This section has no help yet - you can contribute some!' },
	'cpu_hightemp_reset':			{ title: $L('Temp Reset'),				data: 'This section has no help yet - you can contribute some!' },
	'cpu_hightemp_alarm':			{ title: $L('Temp Limit'),				data: 'This section has no help yet - you can contribute some!' },
	'battery_scaleback_percent':	{ title: $L('Battery Low Threshold'),	data: 'This section has no help yet - you can contribute some!' },
	'battery_scaleback_speed':		{ title: $L('Battery Low Speed'),		data: 'This section has no help yet - you can contribute some!' },
	'override_charger':				{ title: $L('Override Charger'),		data: 'This section has no help yet - you can contribute some!' }
};