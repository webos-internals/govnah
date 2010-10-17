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
		data: $L('A governor is what controls the operating frequency of the kernel in real time. Different governors have different parameters, and each governor is unique in the way that it operates. The govnerners available depend upon the installed kernel. The standard set of governors available when the UberKernel is installed are:<ul><li>ondemand - Increases clock speed in response to increases in CPU load.</li><li>conservative - Similar to the ondemand governor. It differs in behaviour in that it gracefully increases and decreases the CPU speed rather than jumping to max speed the moment there is any load on the CPU.</li><li>userspace - Sets the CPU speed to a defined rate as chosen by LunaSysMgr.</li><li>powersave - Sets the CPU speed to the min frequency value.</li><li>performance - Sets the CPU speed to the max frequency value.</li><li>screenstate - Runs at a higher speed when the screen is on and a lower speed when the screen is off.</li></ul>Note: Not all governors are available for all kernels. Some kernels are designed to use a specific governor.')
	},
	
	'scheduler':
	{
		title: $L('I/O Scheduler'),
		data: $L('The Linux kernel is responsible for controlling flash memory access by using kernel I/O scheduling. In layman terms it re-orders the incoming randomly ordered requests into a more efficient order for accessing the flash memory storage. This can have varying effects on performance. By default Palm uses the CFQ I/O scheduler however there are some report of better performance when using the Anticipatory I/O scheduler. The standard set of schedulers available when the UberKernel is installed are:<ul><li>noop - A simple FIFO queue that uses the minimal amount of CPU/instructions per I/O to accomplish basic merging and sorting functionality.</li><li>anticipatory - A controlled delay is introduced before dispatching the I/O to attempt to aggregate and/or re-order requests to improve locality. Using this scheduler may cause higher I/O latency.</li><li>deadline - Uses a deadline algorithm to minimize I/O latency for each I/O request. The scheduler provides near real-time behavior and uses a round robin policy to attempt to be fair among multiple I/O requests and to avoid process starvation.</li><li>cfq - Completely Fair Queuing maintains a scalable per-process I/O queue and attempts to distribute the available I/O bandwidth equally among all I/O requests.</li></ul>')
	},
	
	'congestion':
	{
		title: $L('TCP Congestion'),
		data: $L('This section has no help yet - you can contribute some!')
	},
	
	
	
	'scaling_min_freq':
	{
		title: $L('Min Frequency'),
		data: $L('This sets the lowest CPU clock speed to which your CPU is allowed to scale. For example: if you set this parameter to 500MHz your device will not scale below that speed. Note that some devices may hang at frequencies below 500MHz.')
	},
	
	'scaling_max_freq':
	{
		title: $L('Max Frequency'),
		data: $L('This sets the highest CPU clock speed to which your CPU is allowed to scale. For example: if you set this parameter to 800MHz your device will not scale above that speed. Note that each device has a unique highest working CPU clock speed, and not all devices will overclock to 1GHz and beyond.')
	},
	
	'scaling_setspeed':
	{
		title: $L('SetSpeed'),
		data: $L('This fixes the CPU clock speed at one frequency. For example: if you set this parameter to 500MHz your device will stay at 500MHz regardless of CPU load or screen state. When using the userspace governor, the LunaSysMgr process will override your speed settings.')
	},
	
	'up_threshold':
	{
		title: $L('Up Threshold'),
		data: $L('This parameter decides how much of the CPU needs to be in use before the CPU speed will be increased. For example: if this value is set to the default setting of 80 the CPU will need to be 80% in use before Govnah will increase the speed of the device.')
	},
	
	'down_threshold':
	{
		title: $L('Down Threshold'),
		data: $L('This parameter decides how much the CPU needs to be in use before the CPU speed will be decreased. For example: if the down_threshold is set to 20 the CPU speed will not decrease until is is below 20% use.')
	},
	
	'freq_step':
	{
		title: $L('Frequency Step'),
		data: $L('This will decide how large or small of a percentage the CPU speed will be increased or decreased. For example: if this value is set to to 5% the CPU speed will be adjusted by 5% at a time. So, if the CPU demands more speed then your speed will jump from 5% to 10% and so on. It will also decrease in 5% increments.')
	},
	
	'sampling_rate':
	{
		title: $L('Sampling Rate'),
		data: $L('This is how often the kernel is set to look at CPU usage to make decisions on how to change the CPU speed. This value is measured in microseconds (one millionth of a second) by default and on average this is set to 10000 or more.')
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
		data: $L('Compcache provides the possibility of using parts of the memory as virtual compressed memory. This compressed memory is not as quickly accessed as the normal memory. However, it will help with opening up memory intense apps that would otherwise throw an immediate "Too Many Cards" error.')
	},
	
	'compcache_memlimit':
	{
		title: $L('Compcache Memlimit'),
		data: $L('This value is how much of your physical memory that you would like to use for compressed memory. Thus a higher compcache_memlimit will give you the ability to open more cards. However, due to the slow access of the compressed memory you could miss things like phone calls if the compcache_memlimit is set too high as the device can not open the phone app quick enough to catch the call.')
	},
	
	'vdd1_vsel':
	{
		title: $L('Core Voltages'),
		data: $L('These values represent the various voltage levels for each frequency supported by the kernel.')
	},
	
	'cpu_hightemp_reset':
	{
		title: $L('Temp Reset'),
		data: $L('When the CPU cools down to this temperature the CPU frequency will go back the max frequency that the user has set.')
	},
	
	'cpu_hightemp_alarm':
	{
		title: $L('Temp Limit'),
		data: $L('When the CPU reaches this temperature the CPU speed will be clamped to 500MHz until a user configurable lower temperature is achieved.')
	},
	
	'battery_scaleback_percent':
	{
		title: $L('Battery Low Threshold'),
		data: $L('This value represents how low the battery can go before the kernel will lower the CPU speed to conserve battery power. By default this value is set to 25%. Once this value is attained the kernel will lower the CPU frequency.')
	},
	
	'battery_scaleback_speed':
	{
		title: $L('Battery Low Speed'),
		data: $L('This setting is the frequency that the device will be lowered to once the Low Batt Threshold has been achieved. For example: by default if the the battery reaches 25% charge the CPU speed will be decreased to 500MHz to conserve battery power.')
	},
	
	'override_charger':
	{
		title: $L('Override Charger'),
		data: $L('By default kernels from WebOS Internals running the screenstate governor will scale back to 500MHz to help maintain a lower temperature while charging. However, if you enable override_charger you will be able to run a faster CPU speed while charging. Note: please monitor you CPU temperature while running a higher than stock frequency during charging.')
	}
};