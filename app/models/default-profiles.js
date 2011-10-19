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
 * 	Highest Version: 29
 * 	Be sure to update the above number if you use a higher number, so
 * 	we don't have to look through the entire list if we add a new one.
 * 
 */


var palm_default_pre = {
	version:	12,
	name:		'Palm Default',
	locked:		true,			// don't lock any other profiles but this one
	governor:	'userspace',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'125000'},
{name:	'scaling_max_freq',	value:	'600000'},
{name:	'scaling_setspeed',	value:	'500000'}
					   ],
	kernels: [ "Palm", "UberKernel" ]
};

var palm_default_pixi = {
	version:	12,
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
					   ],
	kernels: [ "Palm", "UberKernel" ]
};

var palm_default_pre2 = {
	version:	12,
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
					   ],
	kernels: [ "Palm", "UberKernel" ]
};

var palm_default_veer = {
	version:	26,
	name:		'Palm Default',
	locked:		true,			// don't lock any other profiles but this one
	governor:	'ondemandtcl',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'122880'},
{name:	'scaling_max_freq',	value:	'806400'}
					   ],
	settingsSpecific: [
{name:	'sampling_rate',		value:	'200000'},
{name:	'up_threshold',			value:	'95'},
{name:	'down_differential',	value:	'3'},
{name:	'ignore_nice_load',		value:	'0'},
{name:	'powersave_bias',		value:	'0'},
{name:	'max_tickle_window',	value:	'3000'},
{name:	'max_floor_window',		value:	'3000'}
					   ],
	kernels: [ "Palm", "UberKernel" ]
};

var palm_default_pre3 = {
	version:	25,
	name:		'Palm Default',
	locked:		true,			// don't lock any other profiles but this one
	governor:	'ondemandtcl',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'122880'},
{name:	'scaling_max_freq',	value:	'1401600'}
					   ],
	settingsSpecific: [
{name:	'sampling_rate',		value:	'200000'},
{name:	'up_threshold',			value:	'95'},
{name:	'down_differential',	value:	'3'},
{name:	'ignore_nice_load',		value:	'0'},
{name:	'powersave_bias',		value:	'0'},
{name:	'max_tickle_window',	value:	'3000'},
{name:	'max_floor_window',		value:	'3000'}
					   ],
	kernels: [ "Palm", "UberKernel" ]
};

var palm_default_touchpad = {
	version:	29,
	name:		'Palm Default',
	locked:		true,			// don't lock any other profiles but this one
	governor:	'ondemandtcl',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'192000'},
{name:	'scaling_max_freq',	value:	'1188000'}
					   ],
	settingsSpecific: [
{name:	'sampling_rate',		value:	'200000'},
{name:	'up_threshold',			value:	'95'},
{name:	'down_differential',	value:	'3'},
{name:	'sampling_down_factor',	value:	'1'},
{name:	'ignore_nice_load',		value:	'0'},
{name:	'powersave_bias',		value:	'0'},
{name:	'io_is_busy',			value:	'0'},
{name:	'max_tickle_window',	value:	'3000'}
					   ],
	kernels: [ "Palm" ]
};

var uberkernel_default_touchpad = {
	version:	29,
	name:		'UberKernel Default',
	locked:		true,			// don't lock any other profiles but this one
	governor:	'ondemandtcl',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'192000'},
{name:	'scaling_max_freq',	value:	'1188000'}
					   ],
	settingsSpecific: [
{name:	'sampling_rate',		value:	'200000'},
{name:	'up_threshold',			value:	'95'},
{name:	'down_differential',	value:	'3'},
{name:	'sampling_down_factor',	value:	'1'},
{name:	'ignore_nice_load',		value:	'0'},
{name:	'powersave_bias',		value:	'0'},
{name:	'io_is_busy',			value:	'0'},
{name:	'max_tickle_window',	value:	'3000'}
					   ],
	kernels: [ "UberKernel" ]
};

var uberkernel_default_pre = {
	version:	12,
	name:		'UberKernel Default',
	locked:		false,
	governor:	'userspace',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'125000'},
{name:	'scaling_max_freq',	value: '1000000'},
{name:	'scaling_setspeed',	value:	'500000'}
					   ],
	kernels: [ "UberKernel" ]
};

var screenstate2_500_800 = {
	version:	12,
	name:		'Screenstate2 500/800',
	locked:		false,
	governor:	'screenstate-v2',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'500000'},
{name:	'scaling_max_freq',	value:  '800000'},
					   ],
	kernels: [ "F102A", "F102B" ]
};

var screenstate2_500_1100 = {
	version:	15,
	name:		'Screenstate2 500/1100',
	locked:		false,
	governor:	'screenstate-v2',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'500000'},
{name:	'scaling_max_freq',	value: '1100000'},
					   ],
	kernels: [ "F104A" ]
};

var vdemand_1005 = {
	version:	19,
	name:		'VDemand 1005',
	locked:		false,
	governor:	'vdemand',
	settingsStandard: [
{name:	'scaling_min_freq',	value:  '500000'},
{name:	'scaling_max_freq',	value: '1005000'},
					   ],
	kernels: [ "AV8B" ]
};

var screenstate2_500_1005 = {
	version:	12,
	name:		'Screenstate2 500/1005',
	locked:		false,
	governor:	'screenstate-v2',
	settingsStandard: [
{name:	'scaling_min_freq',	value:  '500000'},
{name:	'scaling_max_freq',	value: '1005000'},
					   ],
	kernels: [ "F105" ]
};

var f104a_default_pre = {
	version:	15,
	name:		'F104A Default',
	locked:		false,
	governor:	'ondemand',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'500000'},
{name:	'scaling_max_freq',	value: '1100000'},
					   ],
	settingsSpecific: [
{name:	'sampling_rate',		value:	'200000'},
{name:	'up_threshold',			value:	'80'},
{name:	'ignore_nice_load',		value:	'0'},
{name:	'powersave_bias',		value:	'0'}
					   ],
	kernels: [ "F104A" ]
};

var f104a_default_pre2 = {
	version:	17,
	name:		'F104A Default',
	locked:		false,
	governor:	'ondemandtcl',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'300000'},
{name:	'scaling_max_freq',	value: '1100000'},
					   ],
	settingsSpecific: [
{name:	'sampling_rate',		value:	'200000'},
{name:	'up_threshold',			value:	'40'},
{name:	'ignore_nice_load',		value:	'0'},
{name:	'powersave_bias',		value:	'0'},
{name:	'max_tickle_window',	value:	'3000'},
{name:	'max_floor_window',		value:	'3000'}
					   ],
	kernels: [ "F104A" ]
};

var ondemandtcl_1100 = {
	version:	22,
	name:		'OnDemandTcl 1100',
	locked:		false,
	governor:	'ondemandtcl',
	settingsStandard: [
{name:	'scaling_min_freq',	value:  '150000'},
{name:	'scaling_max_freq',	value: '1100000'},
					   ],
	kernels: [ "UberKernel" ]
};

var ondemandtcl_1200_veer = {
	version:	27,
	name:		'OnDemandTcl 1200',
	locked:		false,
	governor:	'ondemandtcl',
	settingsStandard: [
{name:	'scaling_min_freq',	value:  '122880'},
{name:	'scaling_max_freq',	value: '1209600'},
					   ],
	kernels: [ "UberKernel" ]
};

var ondemandtcl_1400 = {
	version:	12,
	name:		'OnDemandTcl 1400',
	locked:		false,
	governor:	'ondemandtcl',
	settingsStandard: [
{name:	'scaling_min_freq',	value:  '150000'},
{name:	'scaling_max_freq',	value: '1400000'},
					   ],
	kernels: [ "F14" ]
};

var ondemandtcl_1512 = {
	version:	21,
	name:		'OnDemandTcl 1512',
	locked:		false,
	governor:	'ondemandtcl',
	settingsStandard: [
{name:	'scaling_min_freq',	value:  '192000'},
{name:	'scaling_max_freq',	value: '1512000'},
					   ],
	kernels: [ "UberKernel", "F15C" ]
};

var screenstate3_150_1100 = {
	version:	24,
	name:		'Screenstate3 1100',
	locked:		false,
	governor:	'screenstate-v3',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'150000'},
{name:	'scaling_max_freq',	value: '1100000'},
					   ],
	kernels: [ "UberKernel" ]
};

var screenstate3_300_1100 = {
	version:	17,
	name:		'Screenstate3 300/1100',
	locked:		false,
	governor:	'screenstate-v3',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'300000'},
{name:	'scaling_max_freq',	value: '1100000'},
					   ],
	kernels: [ "F104A" ]
};

var ondemandtcl_1200_pre = {
	version:	13,
	name:		'OnDemandTcl 1200',
	locked:		false,
	governor:	'ondemandtcl',
	settingsStandard: [
{name:	'scaling_min_freq',	value:  '500000'},
{name:	'scaling_max_freq',	value: '1200000'},
					   ],
	kernels: [ "SR71" ]
};

var ondemandtcl_1200_pre2 = {
	version:	13,
	name:		'OnDemandTcl 1200',
	locked:		false,
	governor:	'ondemandtcl',
	settingsStandard: [
{name:	'scaling_min_freq',	value:  '300000'},
{name:	'scaling_max_freq',	value: '1200000'},
					   ],
	kernels: [ "SR71" ]
};

var warthog_default_pre = {
	version:	12,
	name:		'Warthog Default',
	locked:		false,
	governor:	'userspace',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'125000'},
{name:	'scaling_max_freq',	value: '1050000'},
{name:	'scaling_setspeed',	value:	'500000'}
					   ],
	kernels: [ "Warthog" ]
};

var screenstate_500_800 = {
	version:	12,
	name:		'Screenstate 500/800',
	locked:		false,
	governor:	'screenstate',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'500000'},
{name:	'scaling_max_freq',	value:	'800000'}
					   ],
		kernels: [ "UberKernel" ]
};

var screenstate_500_1000 = {
	version:	12,
	name:		'Screenstate 500/1000',
	locked:		false,
	governor:	'screenstate',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'500000'},
{name:	'scaling_max_freq',	value:	'1000000'}
					   ],
	kernels: [ "UberKernel" ]
};

var screenstate_500_1050 = {
	version:	12,
	name:		'Screenstate 500/1050',
	locked:		false,
	governor:	'screenstate',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'500000'},
{name:	'scaling_max_freq',	value:	'1050000'}
					   ],
	kernels: [ "UberKernel" ]
};

var screenstate2_300_1200 = {
	version:	18,
	name:		'Screenstate2 300/1200',
	locked:		false,
	governor:	'screenstate-v2',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'300000'},
{name:	'scaling_max_freq',	value: '1200000'},
					   ],
	kernels: [ "SR71" ]
};

var fixed_speed_600 = {
	version:	12,
	name:		'Fixed Speed 600',
	locked:		false,
	governor:	'performance',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'600000'},
{name:	'scaling_max_freq',	value:	'600000'}
					   ],
	kernels: [ "UberKernel" ]
};

var fixed_speed_720 = {
	version:	12,
	name:		'Fixed Speed 720',
	locked:		false,
	governor:	'performance',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'720000'},
{name:	'scaling_max_freq',	value:	'720000'}
					   ],
	kernels: [ "UberKernel" ]
};

var fixed_speed_800 = {
	version:	12,
	name:		'Fixed Speed 800',
	locked:		false,
	governor:	'performance',
	settingsStandard: [
{name:	'scaling_min_freq',	value:	'800000'},
{name:	'scaling_max_freq',	value:	'800000'}
					   ],
	kernels: [ "UberKernel" ]
};

var ondemandtcl_749 = {
	version:	12,
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
					   ],
	kernels: [ "UberKernel" ]
};

var ondemandtcl_768 = {
	version:	12,
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
					   ],
	kernels: [ "UberKernel" ]
};

var ondemandtcl_787 = {
	version:	12,
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
					   ],
	kernels: [ "UberKernel" ]
};

var ondemandtcl_806 = {
	version:    12,
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
					   ],
	kernels: [ "UberKernel" ]
};

profilesModel.defaultProfiles = [];

profilesModel.populateDefaults = function()
{
	switch (Mojo.Environment.DeviceInfo.modelNameAscii) {

	case "Pre": {

		profilesModel.defaultProfiles.push(screenstate_500_1000);
		profilesModel.defaultProfiles.push(screenstate_500_800);
		profilesModel.defaultProfiles.push(fixed_speed_800);
		profilesModel.defaultProfiles.push(fixed_speed_720);
		profilesModel.defaultProfiles.push(fixed_speed_600);

		profilesModel.defaultProfiles.push(uberkernel_default_pre);
		profilesModel.defaultProfiles.push(vdemand_1005);
		profilesModel.defaultProfiles.push(screenstate2_500_800);
		profilesModel.defaultProfiles.push(screenstate2_500_1005);
		profilesModel.defaultProfiles.push(screenstate2_500_1100);
		profilesModel.defaultProfiles.push(f104a_default_pre);
		profilesModel.defaultProfiles.push(ondemandtcl_1200_pre);
		profilesModel.defaultProfiles.push(warthog_default_pre);

		profilesModel.defaultProfiles.push(palm_default_pre);

		break;
    };

	case "Pixi": {
		
		profilesModel.defaultProfiles.push(ondemandtcl_806);
		profilesModel.defaultProfiles.push(ondemandtcl_787);
		profilesModel.defaultProfiles.push(ondemandtcl_768);
		profilesModel.defaultProfiles.push(ondemandtcl_749);
			
		profilesModel.defaultProfiles.push(palm_default_pixi);

		break;
	};
	
	case "Pre2": {

		profilesModel.defaultProfiles.push(ondemandtcl_1400);
		profilesModel.defaultProfiles.push(ondemandtcl_1200_pre2);
		profilesModel.defaultProfiles.push(ondemandtcl_1100);
		profilesModel.defaultProfiles.push(screenstate2_300_1200);
		profilesModel.defaultProfiles.push(screenstate3_150_1100);
		profilesModel.defaultProfiles.push(screenstate3_300_1100);
		profilesModel.defaultProfiles.push(f104a_default_pre2);

		profilesModel.defaultProfiles.push(palm_default_pre2);

		break;
	};

	case "Veer": {

		profilesModel.defaultProfiles.push(ondemandtcl_1200_veer);

		profilesModel.defaultProfiles.push(palm_default_veer);

		break;
	};

	case "Pre3": {

		profilesModel.defaultProfiles.push(palm_default_pre3);

		break;
	};

	case "TouchPad": {

		profilesModel.defaultProfiles.push(ondemandtcl_1512);
		profilesModel.defaultProfiles.push(uberkernel_default_touchpad);
		profilesModel.defaultProfiles.push(palm_default_touchpad);

		break;
	};

	};
};

// Local Variables:
// tab-width: 4
// End:
