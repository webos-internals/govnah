
/* 
 * 	The value of the version field is important:
 * 
 * 	1.	On the first run, the app will load all profiles, and save
 * 		the highest version number found for later.
 * 
 * 	2.	After an update, on the next run, the app will load all
 * 		profiles with a version number higher then what it saved
 * 		on the first run, and then save the new highest version number.
 * 
 * 	Profiles with the same name already on the device will be overwritten
 * 	by these values, Choose the names wisely.
 * 
 ********
 * 
 * 	Highest Version: 8
 * 	Be sure to update the above number if you use a higher number, so
 * 	we don't have to look through the entire list if we add a new one.
 * 
 */


profilesModel.defaultProfiles = [];
profilesModel.populateDefaults = function()
{
	if (Mojo.Environment.DeviceInfo.modelNameAscii == "Pre")
	{
		profilesModel.defaultProfiles.push
		(
			// Screenstate 500/1000
			{
				version:	7,
				name:		'Screenstate 500/1000',
				locked:		false,
				governor:	'screenstate',
				settingsStandard:
				[
					{name:	'scaling_min_freq',	value:	'500000'},
					{name:	'scaling_max_freq',	value:	'1000000'},
				],
			},
			
			// Screenstate 500/800
			{
				version:	7,
				name:		'Screenstate 500/800',
				locked:		false,
				governor:	'screenstate',
				settingsStandard:
				[
					{name:	'scaling_min_freq',	value:	'500000'},
					{name:	'scaling_max_freq',	value:	'800000'},
				],
			},
			
			// Fixed Speed 800
			{
				version:	7,
				name:		'Fixed Speed 800',
				locked:		false,
				governor:	'performance',
				settingsStandard:
				[
					{name:	'scaling_min_freq',	value:	'800000'},
					{name:	'scaling_max_freq',	value:	'800000'},
				],
			},
			
			// Fixed Speed 720
			{
				version:	7,
				name:		'Fixed Speed 720',
				locked:		false,
				governor:	'performance',
				settingsStandard:
				[
					{name:	'scaling_min_freq',	value:	'720000'},
					{name:	'scaling_max_freq',	value:	'720000'},
				],
			},
			
			// Fixed Speed 600
			{
				version:	7,
				name:		'Fixed Speed 600',
				locked:		false,
				governor:	'performance',
				settingsStandard:
				[
					{name:	'scaling_min_freq',	value:	'600000'},
					{name:	'scaling_max_freq',	value:	'600000'},
				],
			},
			
			// UberKernel Default
			{
				version:	7,
				name:		'UberKernel Default',
				locked:		false,
				governor:	'userspace',
				settingsStandard:
				[
					{name:	'scaling_min_freq',	value:	'125000'},
					{name:	'scaling_max_freq',	value: '1000000'},
					{name:	'scaling_setspeed',	value:	'500000'}
				],
			},
			
			// The stock palm settings
			{
				version:	7,
				name:		'Palm Default',
				locked:		true,			// don't lock any other profiles but this one
				governor:	'userspace',
				settingsStandard:
				[
					{name:	'scaling_min_freq',	value:	'125000'},
					{name:	'scaling_max_freq',	value:	'600000'},
					{name:	'scaling_setspeed',	value:	'500000'}
				],
			}
			
		);
	}
	
	if (Mojo.Environment.DeviceInfo.modelNameAscii == "Pixi")
	{
		profilesModel.defaultProfiles.push
		(
			// Fixed Speed 600
			{
				version:	7,
				name:		'Fixed Speed 600',
				locked:		false,
				governor:	'performance',
				settingsStandard:
				[
					{name:	'scaling_min_freq',	value:	'600000'},
					{name:	'scaling_max_freq',	value:	'600000'},
				],
			},
			
			// The stock palm settings
			{
				version:	7,
				name:		'Palm Default',
				locked:		true,			// don't lock any other profiles but this one
				governor:	'ondemandtcl',
				settingsStandard:
				[
					{name:	'scaling_min_freq',	value:	'122880'},
					{name:	'scaling_max_freq',	value:	'600000'},
				],
				settingsSpecific:
				[
					{name:	'sampling_rate',		value:	'200000'},
					{name:	'up_threshold',			value:	'80'},
					{name:	'ignore_nice_load',		value:	'0'},
					{name:	'powersave_bias',		value:	'0'},
					{name:	'max_tickle_window',	value:	'3000'},
					{name:	'max_floor_window',		value:	'3000'},
				]
			}
		);
	}
	
	if (Mojo.Environment.DeviceInfo.modelNameAscii == "Pre2")
	{
		profilesModel.defaultProfiles.push
		(
			// The stock palm settings
			{
				version:	8,
				name:		'Palm Default',
				locked:		true,			// don't lock any other profiles but this one
				governor:	'ondemandtcl',
				settingsStandard:
				[
					{name:	'scaling_min_freq',	value:	'150000'},
					{name:	'scaling_max_freq',	value:	'1000000'},
				],
				settingsSpecific:
				[
					{name:	'sampling_rate',		value:	'200000'},
					{name:	'up_threshold',			value:	'40'},
					{name:	'ignore_nice_load',		value:	'0'},
					{name:	'powersave_bias',		value:	'0'},
					{name:	'max_tickle_window',	value:	'3000'},
					{name:	'max_floor_window',		value:	'3000'},
				],
			}
		);
	}
}