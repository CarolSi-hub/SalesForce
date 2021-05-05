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
    var URLUtils = require('dw/web/URLUtils');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    
    if(signInDealerForm.valid) {

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
                
                var Site=require('dw/system/Site');
                var dealerObject={
                    fantasyname: signInDealerForm.fantasyname.value,
                    email: signInDealerForm.email.value,
                    cnpj:signInDealerForm.cnpj.value,
                    url: URLUtils.https('Home-Show')
                };

                var emailObj = {
                    to:signInDealerForm.email.value,
                    subject:'Solicitacao Enviada com Sucesso',
                    from: Site.current.getCustomPreferenceValue('custumerServiceEmail') || 'silva.anacaroline@yahoo.com.br',
                    type: emailHelpers.emailTypes.registration
                };

                emailHelpers.send(emailObj,'/account/signindealer/signInDealerEmail',dealerObject);

    
            res.render('/account/signindealer/registerDealerSucess', {
                signInDealerForm: signInDealerForm
            }); 

        }else {
            res.json({
                success: false,
                fields: formErrors.getFormErrors(signInDealerForm)
            });
        }
            return next();    

    });

module.exports = server.exports();
