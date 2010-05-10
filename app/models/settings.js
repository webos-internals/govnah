profilesModel.settings = 
{
	'scaling_min_freq':
	{
		nice: 'min freq',
		type: 'listFreq',
	},
	'scaling_max_freq':
	{
		nice: 'max freq',
		type: 'listFreq',
	},
	'scaling_setspeed':
	{
		nice: 'setspeed',
		type: 'listFreq',
	},
	'up_threshold':
	{
		type: 'listPcnt',
	},
	'down_threshold':
	{
		type: 'listPcnt',
	},
	'freq_step':
	{
		type: 'listPcnt',
	},
	'sampling_rate':
	{
		type: 'listSamp',
	},
	'sampling_down_factor':
	{
		type: 'listSampDown',
	},
	'powersave_bias':
	{
		type: 'listPowr',
	},
	'ignore_nice_load':
	{
		type: 'toggleTF',
	}
};

profilesModel.settingLabel = function(name)
{
	return (profilesModel.settings[name].nice ? profilesModel.settings[name].nice : name.replace(/_/g, " "));
}
