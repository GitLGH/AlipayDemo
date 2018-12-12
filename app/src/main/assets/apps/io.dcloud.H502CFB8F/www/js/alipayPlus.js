document.addEventListener( "plusready",  function()
{
    var _BARCODE = 'Alipay',
		B = window.plus.bridge;
    var ALipayPlugin =
    {
           /*
           //同步
           alipayLogin : function (Argus)
            {
                return B.execSync(_BARCODE, "alipayLogin", [Argus]);
            }*/
        //异步
    	alipayLogin : function (Argus1, successCallback, errorCallback )
		{
			var success = typeof successCallback !== 'function' ? null : function(args)
			{
				successCallback(args);
			},
			fail = typeof errorCallback !== 'function' ? null : function(code)
			{
				errorCallback(code);
			};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "alipayLogin", [callbackID, Argus1]);
		}
    };
   window.plus.Alipay = ALipayPlugin
}, true );
