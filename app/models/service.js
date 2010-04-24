service.identifier = 'palm://org.webosinternals.govnah';

function service(){};

service.get_proc_cpuinfo = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_proc_cpuinfo',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_omap34xx_temp = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_omap34xx_temp',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_scaling_available_governors = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_scaling_available_governors',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_scaling_available_frequencies = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_scaling_available_frequencies',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_scaling_governor = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_scaling_governor',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.set_scaling_governor = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'set_scaling_governor',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_scaling_max_freq = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_scaling_max_freq',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.set_scaling_max_freq = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'set_scaling_max_freq',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_scaling_min_freq = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_scaling_min_freq',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.set_scaling_min_freq = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'set_scaling_min_freq',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_scaling_cur_freq = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_scaling_cur_freq',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_scaling_setspeed = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_scaling_setspeed',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.set_scaling_setspeed = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'set_scaling_setspeed',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_time_in_state = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_time_in_state',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_total_trans = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_total_trans',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_trans_table = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_trans_table',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_ignore_nice_load = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_ignore_nice_load',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.set_ignore_nice_load = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'set_ignore_nice_load',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_powersave_bias = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_powersave_bias',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.set_powersave_bias = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'set_powersave_bias',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_sampling_rate = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_sampling_rate',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.set_sampling_rate = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'set_sampling_rate',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_sampling_rate_max = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_sampling_rate_max',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_sampling_rate_min = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_sampling_rate_min',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_up_threshold = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_up_threshold',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.set_up_threshold = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'set_up_threshold',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_down_threshold = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_down_threshold',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.set_down_threshold = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'set_down_threshold',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_freq_step = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_freq_step',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.set_freq_step = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'set_freq_step',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_sampling_down_factor = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_sampling_down_factor',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.set_sampling_down_factor = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'set_sampling_down_factor',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};



// Local Variables:
// tab-width: 4
// End:
