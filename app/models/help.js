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
		return { title: lookup.replace(/_/g, " ").replace(/-/g, " "), data: 'This section isn\'t configured in the help model. Call a programmer! ('+lookup+')' };
	}
	return false; // this shouldn't happen
}

helpData.lookup = 
{
	'governor':
	{
		title: $L('Governor'),
		data: $L('A governor is what sets the operating parameters for the kernel. Different governors have different parameters like running a low clock speed when the screen is off and a higher clock speed with it on.')
	},
	
	'scheduler':
	{
		title: $L('I/O Scheduler'),
		data: $L('I/O scheduling is how your OS decides how to order I/O blocks of information will be submitted to storage volume. In layman terms it re-orders the incoming randomly ordered requests into the order in which they will be found by the system. This can have varying effects on performance. By default Palm uses the CFQ I/O scheduler however it is believed by some that it is best to run the Anticipatory I/O scheduler for purposes of performance.')
	},
	
	'congestion':
	{
		title: $L('TCP Congestion'),
		data: $L('This section has no help yet - you can contribute some!')
	},
	
	
	
	'scaling_min_freq':
	{
		title: $L('Min Frequency'),
		data: $L('This sets the lowest CPU clock speed that your CPU is allowed to scale to. For example: if you set this parameter to 500MHz your device will not scale below that speed.')
	},
	
	'scaling_max_freq':
	{
		title: $L('Max Frequency'),
		data: $L('This sets the highest CPU clock speed that your CPU is allowed to scale to. For example: if you set this parameter to 800MHz your device will not scale above that speed.')
	},
	
	'scaling_setspeed':
	{
		title: $L('SetSpeed'),
		data: $L('This parameter decides how much of the CPU needs to be in use before CPU speed will be increased. For example: if this value is set to the default setting of 80 the CPU will need to be 80% in use before Govnah will increase the speed of the device.')
	},
	
	'up_threshold':
	{
		title: $L('Up Threshold'),
		data: $L('This parameter decides how much of the CPU needs to be in use before CPU speed will be increased. For example: if this value is set to the default setting of 80 the CPU will need to be 80% in use before Govnah will increase the speed of the device.')
	},
	
	'down_threshold':
	{
		title: $L('Down Threshold'),
		data: $L('This parameter decides how much the CPU needs to be in use before CPU speed will be decreased. For example: if the down_threshold is set to 20 the CPU speed will not decrease until is is below 20% use.')
	},
	
	'freq_step':
	{
		title: $L('Frequency Step'),
		data: $L('This will decide how large or small of a percentage that CPU speed will be increased or decreased. For example: if this value is set to to 5% the CPU speed will be adjusted by 5% at a time. So, if the CPU demands more speed then your speed will jump from 5% to 10% and so on. It will also decrease in 5% increments.')
	},
	
	'sampling_rate':
	{
		title: $L('Sampling Rate'),
		data: $L('This is how often the kernel is set to look at CPU usage to make decisions how to change CPU speed. This value is measured in microseconds (one millionth of a second) by default. On average this is set to 10000 or more.')
	},
	
	'sampling_down_factor':
	{
		title: $L('Sampling Down Factor'),
		data: $L('This controls how often the CPU makes the decision to lowers the frequency. For example: if this value is set to 5 the kernel will have to have made the decision to lower frequency 5 times in a row.')
	},
	
	'powersave_bias':
	{
		title: $L('Powersave Bias'),
		data: $L('This parameter is available with the ondemand governor. By changing this parameter you can adjust the performance to power efficiency ratio. This value is set to 0 by default thus maintaining the highest performance to power efficiency ratio. However, there are times when you may want a higher ratio of power efficiency to help with battery savings. It is to be noted that this is for <b>experienced users only</b>.')
	},
	
	'ignore_nice_load':
	{
		title: $L('Ignore Nice Load'),
		data: $L('This parameter only has two values which are 0 and 1. By default it is set to 0 which means that all processes are calculated in CPU usage samples. If this value is set to 1 then all processes that hold a "nice" value will be ignored in the CPU usage samples.')
	},
	
	'max_tickle_window':
	{
		title: $L('Max Tickle Window'),
		data: $L('This section has no help yet - you can contribute some!')
	},
	
	'max_floor_window':
	{
		title: $L('Max Floor Window'),
		data: $L('This section has no help yet - you can contribute some!')
	},
	
	'compcache_enabled':
	{
		title: $L('Compcache Enabled'),
		data: $L('Compcache provides a possibility of using parts of the memory as virtual compressed memory. This compressed memory is not as quickly accessed as the normal memory. However, it will help with opening up memory intense apps that would otherwise throw an immediate "Too Many Cards" error.')
	},
	
	'compcache_memlimit':
	{
		title: $L('Compcache Memlimit'),
		data: $L('This value is how much of your physical memory that you would like to use for compressed memory. Thus a higher compcache_memlimit will give you the ability to open more cards. However, due to the slow access of the compressed memory you could miss things like phone calls if the compcache_memlimit is set too high as the device can not open the phone app quick enough to catch the call.')
	},
	
	'vdd1_vsel':
	{
		title: $L('Core Voltages'),
		data: $L('The values included in represent the various voltage levels for each frequency of the kernel. These values represent the frequencies from highest to lowest left to right. For example: the value to the far left represents 1GHz with UberKernel while the value on the far right represents 12dMHz.')
	},
	
	'cpu_hightemp_reset':
	{
		title: $L('Temp Reset'),
		data: $L('This section has no help yet - you can contribute some!')
	},
	
	'cpu_hightemp_alarm':
	{
		title: $L('Temp Limit'),
		data: $L('This section has no help yet - you can contribute some!')
	},
	
	'battery_scaleback_percent':
	{
		title: $L('Battery Low Threshold'),
		data: $L('This value represents how low the battery can go before the kernel will scaleback to conserve battery power. By default this value is set to 25%. Once this value is attained Govnah will knock the CPU frequency back as well as dim the screen and the keyboard of your device.')
	},
	
	'battery_scaleback_speed':
	{
		title: $L('Battery Low Speed'),
		data: $L('This setting is the frequency that the device will be lowered to once the Low Batt Thresh has been achieved. For example: by default if the the battery reaches 25% charge the CPU speed will be decrease to 500MHz to conserve battery power.')
	},
	
	'override_charger':
	{
		title: $L('Override Charger'),
		data: $L('By default kernels from WebOS Internals scale back to 500MHz to help maintain a lower temperature while charging. However, if you enable override_charger you will be able to run a faster CPU speed while charging. Note: please monitor you CPU temperature while running a higher than stock frequency during charging.')
	}
};