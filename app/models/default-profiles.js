
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
 * 	Highest Version: 9
 * 	Be sure to update the above number if you use a higher number, so
 * 	we don't have to look through the entire list if we add a new one.
 * 
 */


var screenstate_500_1050 = {
	version:	9,
	name:		'Screenstate 500/1050',
	locked:		false,
	governor:	'screenstate',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'500000'},
{name:	'scaling_max_freq',	value:	'1050000'}
					   ]
		};

var screenstate_500_1000 = {
	version:	7,
	name:		'Screenstate 500/1000',
	locked:		false,
	governor:	'screenstate',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'500000'},
{name:	'scaling_max_freq',	value:	'1000000'}
					   ]
		};

var screenstate_500_800 = {
	version:	7,
	name:		'Screenstate 500/800',
	locked:		false,
	governor:	'screenstate',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'500000'},
{name:	'scaling_max_freq',	value:	'800000'}
					   ]
		};

var fixed_speed_800 = {
	version:	7,
	name:		'Fixed Speed 800',
	locked:		false,
	governor:	'performance',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'800000'},
{name:	'scaling_max_freq',	value:	'800000'}
					   ]
		};

var fixed_speed_720 = {
	version:	7,
	name:		'Fixed Speed 720',
	locked:		false,
	governor:	'performance',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'720000'},
{name:	'scaling_max_freq',	value:	'720000'}
					   ]
		};

var fixed_speed_600 = {
	version:	7,
	name:		'Fixed Speed 600',
	locked:		false,
	governor:	'performance',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'600000'},
{name:	'scaling_max_freq',	value:	'600000'}
					   ]
		};

var uberkernel_default_pre = {
	version:	7,
	name:		'UberKernel Default',
	locked:		false,
	governor:	'userspace',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'125000'},
{name:	'scaling_max_freq',	value: '1000000'},
{name:	'scaling_setspeed',	value:	'500000'}
					   ],
		};

var f102a_default_pre = {
	version:	9,
	name:		'F102A Default',
	locked:		false,
	governor:	'screenstate-v2',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'500000'},
{name:	'scaling_max_freq',	value:  '800000'},
					   ],
		};

var f104a_default_pre = {
	version:	9,
	name:		'F104A Default',
	locked:		false,
	governor:	'screenstate',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'250000'},
{name:	'scaling_max_freq',	value: '1100000'},
					   ],
		};

var av8b_default_pre = {
	version:	9,
	name:		'AV8B Default',
	locked:		false,
	governor:	'vdemand',
	settingsStandard: [
{name:	'scaling_min_freq',	value: '1005000'},
{name:	'scaling_max_freq',	value: '1005000'},
					   ],
		};

var f105_default_pre = {
	version:	9,
	name:		'F105 Default',
	locked:		false,
	governor:	'screenstate-v2',
	settingsStandard: [
{name:	'scaling_min_freq',	value:  '500000'},
{name:	'scaling_max_freq',	value: '1005000'},
					   ],
		};

var sr71_default_pre = {
	version:	9,
	name:		'SR71 Default',
	locked:		false,
	governor:	'ondemandtcl',
	settingsStandard: [
{name:	'scaling_min_freq',	value:  '500000'},
{name:	'scaling_max_freq',	value: '1200000'},
					   ],
		};

var warthog_default_pre = {
	version:	9,
	name:		'Warthog Default',
	locked:		false,
	governor:	'userspace',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'125000'},
{name:	'scaling_max_freq',	value: '1050000'},
{name:	'scaling_setspeed',	value:	'500000'}
					   ],
		};

var palm_default_pre = {
	version:	7,
	name:		'Palm Default',
	locked:		true,			// don't lock any other profiles but this one
	governor:	'userspace',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'125000'},
{name:	'scaling_max_freq',	value:	'600000'},
{name:	'scaling_setspeed',	value:	'500000'}
					   ],
		};

var ondemandtcl_806 = {
	version:	9,
	name:		'OnDemandTcl 806',
	locked:		false,
	governor:	'ondemandtcl',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'122880'},
{name:	'scaling_max_freq',	value:	'806400'}
					   ],
	settingsSpecific: [
{name:	'sampling_rate',		value:	'200000'},
{name:	'up_threshold',			value:	'80'},
{name:	'ignore_nice_load',		value:	'0'},
{name:	'powersave_bias',		value:	'0'},
{name:	'max_tickle_window',	value:	'3000'},
{name:	'max_floor_window',		value:	'3000'}
					   ]
		};

var ondemandtcl_787 = {
	version:	9,
	name:		'OnDemandTcl 787',
	locked:		false,
	governor:	'ondemandtcl',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'122880'},
{name:	'scaling_max_freq',	value:	'787200'}
					   ],
	settingsSpecific: [
{name:	'sampling_rate',		value:	'200000'},
{name:	'up_threshold',			value:	'80'},
{name:	'ignore_nice_load',		value:	'0'},
{name:	'powersave_bias',		value:	'0'},
{name:	'max_tickle_window',	value:	'3000'},
{name:	'max_floor_window',		value:	'3000'}
					   ]
		};

var ondemandtcl_768 = {
	version:	9,
	name:		'OnDemandTcl 768',
	locked:		false,
	governor:	'ondemandtcl',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'122880'},
{name:	'scaling_max_freq',	value:	'768000'}
					   ],
	settingsSpecific: [
{name:	'sampling_rate',		value:	'200000'},
{name:	'up_threshold',			value:	'80'},
{name:	'ignore_nice_load',		value:	'0'},
{name:	'powersave_bias',		value:	'0'},
{name:	'max_tickle_window',	value:	'3000'},
{name:	'max_floor_window',		value:	'3000'}
					   ]
		};

var ondemandtcl_749 = {
	version:	9,
	name:		'OnDemandTcl 749',
	locked:		false,
	governor:	'ondemandtcl',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'122880'},
{name:	'scaling_max_freq',	value:	'748800'}
					   ],
	settingsSpecific: [
{name:	'sampling_rate',		value:	'200000'},
{name:	'up_threshold',			value:	'80'},
{name:	'ignore_nice_load',		value:	'0'},
{name:	'powersave_bias',		value:	'0'},
{name:	'max_tickle_window',	value:	'3000'},
{name:	'max_floor_window',		value:	'3000'}
					   ]
		};

var palm_default_pixi = {
	version:	7,
	name:		'Palm Default',
	locked:		true,			// don't lock any other profiles but this one
	governor:	'ondemandtcl',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'122880'},
{name:	'scaling_max_freq',	value:	'600000'}
					   ],
	settingsSpecific: [
{name:	'sampling_rate',		value:	'200000'},
{name:	'up_threshold',			value:	'80'},
{name:	'ignore_nice_load',		value:	'0'},
{name:	'powersave_bias',		value:	'0'},
{name:	'max_tickle_window',	value:	'3000'},
{name:	'max_floor_window',		value:	'3000'}
					   ]
		};

var palm_default_pre2 = {
	version:	8,
	name:		'Palm Default',
	locked:		true,			// don't lock any other profiles but this one
	governor:	'ondemandtcl',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'150000'},
{name:	'scaling_max_freq',	value:	'1000000'}
					   ],
	settingsSpecific: [
{name:	'sampling_rate',		value:	'200000'},
{name:	'up_threshold',			value:	'40'},
{name:	'ignore_nice_load',		value:	'0'},
{name:	'powersave_bias',		value:	'0'},
{name:	'max_tickle_window',	value:	'3000'},
{name:	'max_floor_window',		value:	'3000'}
					   ]
		};

profilesModel.defaultProfiles = [];
profilesModel.populateDefaults = function()
{
	switch (Mojo.Environment.DeviceInfo.modelNameAscii) {

	case "Pre": {
		switch (profiles.kernel) {
		case "UberKernel": {
			profilesModel.defaultProfiles.push(screenstate_500_1000);
			profilesModel.defaultProfiles.push(screenstate_500_800);
			profilesModel.defaultProfiles.push(fixed_speed_800);
			profilesModel.defaultProfiles.push(fixed_speed_720);
			profilesModel.defaultProfiles.push(fixed_speed_600);
			profilesModel.defaultProfiles.push(uberkernel_default_pre);
			break;
		};
		case "AV8B": {
			profilesModel.defaultProfiles.push(av8b_default_pre);
			break;
		};
		case "F102A": {
			profilesModel.defaultProfiles.push(f102a_default_pre);
			break;
		};
		case "F104A": {
			profilesModel.defaultProfiles.push(f104a_default_pre);
			break;
		};
		case "F105": {
			profilesModel.defaultProfiles.push(f105_default_pre);
			break;
		};
		case "SR71": {
			profilesModel.defaultProfiles.push(sr71_default_pre);
			break;
		};
		case "Warthog": {
			profilesModel.defaultProfiles.push(warthog_default_pre);
			break;
		};
		};

		profilesModel.defaultProfiles.push(palm_default_pre);
		break;
    };

	case "Pixi": {
		
		switch (profiles.kernel) {
		case "UberKernel": {
			profilesModel.defaultProfiles.push(ondemandtcl_806);
			profilesModel.defaultProfiles.push(ondemandtcl_787);
			profilesModel.defaultProfiles.push(ondemandtcl_768);
			profilesModel.defaultProfiles.push(ondemandtcl_749);
			profilesModel.defaultProfiles.push(uberkernel_default_pixi);
			break;
		};
		};
			
		profilesModel.defaultProfiles.push(palm_default_pixi);
		break;
	};
	
	case "Pre2": {

		// The stock palm settings
		profilesModel.defaultProfiles.push(palm_default_pre2);
		break;
	};
	};
};

// Local Variables:
// tab-width: 4
// End:
