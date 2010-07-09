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
service.get_proc_meminfo = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_proc_meminfo',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_proc_loadavg = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_proc_loadavg',
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
service.get_tmp105_temp = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_tmp105_temp',
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

service.get_cpufreq_params = function(callback, governor)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_cpufreq_params',
		parameters:
		{
			governor: governor
		},
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.set_cpufreq_params = function(callback, genericParams, governorParams)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'set_cpufreq_params',
		parameters:
		{
			genericParams: genericParams,
			governorParams: governorParams
		},
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.stick_cpufreq_params = function(callback, genericParams, governorParams)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'stick_cpufreq_params',
		parameters:
		{
			genericParams: genericParams,
			governorParams: governorParams
		},
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};

service.get_compcache_config = function(callback, governor)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_compcache_config',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.set_compcache_config = function(callback, compcacheConfig)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'set_compcache_config',
		parameters:
		{
			compcacheConfig: compcacheConfig
		},
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.stick_compcache_config = function(callback, compcacheConfig)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'stick_compcache_config',
		parameters:
		{
			compcacheConfig: compcacheConfig
		},
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
service.get_pre_curr = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_pre_curr',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};
service.get_pixi_curr = function(callback)
{
	var request = new Mojo.Service.Request(service.identifier,
	{
		method: 'get_pixi_curr',
		onSuccess: callback,
		onFailure: callback
	});
	return request;
};


// Local Variables:
// tab-width: 4
// End:
