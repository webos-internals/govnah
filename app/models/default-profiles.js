
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
 * 	Highest Version: 1
 * 	Be sure to update the above number if you use a higher number, so
 * 	we don't have to look through the entire list if we add a new one.
 * 
 */


profilesModel.defaultProfiles = [

	// the stock pre settings
	{
		version:	1,
		name:		'Stock',
		governor:	'userspace',
		settingsStandard: [
			{name:	'scaling_min_freq',	value:	'125000'},
			{name:	'scaling_max_freq',	value:	'800000'}
		],
		settingsSpecific: [
			{name:	'scaling_setspeed',	value:	'500000'}
		]
	}

];