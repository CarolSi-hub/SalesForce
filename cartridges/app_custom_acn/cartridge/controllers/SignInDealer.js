'use strict';

var server = require('server');

server.get('Register', 
function (req, res, next){
        var URLUtils = require('dw/web/URLUtils');
        var signInDealerForm = server.forms.getForm('profileDealer');

        signInDealerForm.clear();

        res.render('/account/signindealer/signInDealer', {
                actionUrl: URLUtils.url('SignInDealer-Subscribe').toString(), 
                signInDealerForm: signInDealerForm
            });
        
        next();    
});

server.post('Subscribe', server.middleware.https, function (req, res, next) {
    var signInDealerForm = server.forms.getForm('profileDealer');  
    var transaction=require('dw/system/Transaction');     

     transaction.wrap( function(){
        
        var CustomObjectMgr = require('dw/object/CustomObjectMgr');
        var newSubscribe = CustomObjectMgr.createCustomObject('SignInDealer',
        signInDealerForm.email.value);
                
                newSubscribe.custom.fantasyname = signInDealerForm.fantasyname.value;
                newSubscribe.custom.socialname = signInDealerForm.socialname.value;
                newSubscribe.custom.cnpj = signInDealerForm.cnpj.value;
                newSubscribe.custom.phone = signInDealerForm.phone.value;
                newSubscribe.custom.password = signInDealerForm.password.value;
            });
            
              
            res.render('/account/signindealer/registerDealerSucess', {
                signInDealerForm: signInDealerForm
            }); 
      
        return next();
    });

module.exports = server.exports();
