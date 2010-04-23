service.identifier = 'palm://org.webosinternals.govnah';

function service(){};

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

// Local Variables:
// tab-width: 4
// End:
