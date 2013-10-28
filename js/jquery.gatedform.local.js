$.validator.setDefaults({
    ignore: []
    // any other default options and/or rules
});

$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(encodeURIComponent(this.value) || '');
        } else {
            o[this.name] = encodeURIComponent(this.value) || '';
        }
    });

    console.info("serializeObject: ", o);
    return o;
};

var DynamicForm = window.DynamicForm = window.DynamicForm || {};

DynamicForm.Cache = {};
DynamicForm.Cache.LookupData = {};
DynamicForm.LookupData = {};

DynamicForm.Cookies = {
    list: ["rh_omni_tc", "rh_omni_itc", "rh_pid", "rh_offer_id"],
    Process: function(name) {
        if (DynamicForm.CheckValue(name)) {
            DynamicForm.Cookies.ProcessByName(name);
        } else {
            for (i in DynamicForm.Cookies.list) {
                var cookie = DynamicForm.Cookies.list[i];
                DynamicForm.Cookies.ProcessByName(cookie);
            }
        }
    },
    ProcessByName: function(name) {
        switch (name) {
            case 'undefined':
                /* Falls Trough */
            case '':
                break;
            case 'rh_omni_tc':
                /* Falls Trough */
            case 'sc_cid':
                var value = DynamicForm.GetTacticID('ext');
                if (DynamicForm.CheckValue(value)) {
                    DynamicForm.Cookies.Write(name, value);
                }
                break;
            case 'rh_omni_itc':
                /* Falls Trough */
            case 'intcmp':
                var value = DynamicForm.GetTacticID('int');

                if (DynamicForm.CheckValue(value)) {
                    try {
                        if (!s.c_r('rh_omni_tc') && !value) {
                            var chk_ref = document.referrer;
                            value = (chk_ref) ? '70160000000H4AoAAK' : '70160000000H4AjAAK';
                            DynamicForm.Cookies.Delete(name);
                            DynamicForm.Cookies.Write(name, value, 1, 365);
                        }

                        if (s.c_r('rh_omni_tc') == '70160000000H4Aj' && !value) {
                            var value = '70160000000H4AjAAK';

                            DynamicForm.Cookies.Delete(name);
                            DynamicForm.Cookies.Write(name, value, 1, 365);
                        }

                        if (s.c_r('rh_omni_tc') == '70160000000H4Ao' && !value) {
                            var value = '70160000000H4AoAAK';

                            DynamicForm.Cookies.Delete(name);
                            DynamicForm.Cookies.Write(name, value, 1, 365);
                        }
                    } catch (e) {
                        DynamicForm.error("DynamicForm.Cookies.ProcessByName",e);
                    }
                }

                //DynamicForm.Cookies.Write(name,value);
                break;
            case 'rh_pid':
                /* Falls Trough */
            case 'pid':
                var value = DynamicForm.Cookies.Read(name);
                if (DynamicForm.CheckValue(value)) {
                    break;
                } else {
                    value = DynamicForm.GetPartnerID();
                    if (DynamicForm.CheckValue(value)) {
                        DynamicForm.Cookies.Delete(name);
                        DynamicForm.Cookies.Write(name, value, 1);
                    }
                    break;
                }
            case 'rh_offer_id':
                /* Falls Trough */
            case 'offer_id':
                var value = DynamicForm.GetOfferID();

                if (DynamicForm.CheckValue(value)) {
                    //if (typeof value !== 'string') {
                    //}

                    //DynamicForm.Cookies.Delete(name);
                    DynamicForm.Cookies.Write(name, value);
                }
                break;
        }
    },
    Write: function(n, v, e, p) {
        var name = n,
            value = v,
            expires = e,
            path = p || "/";

        if (DynamicForm.CheckValue(name) || DynamicForm.CheckValue(value)) {
            $.cookie(name, value, {
                expires: expires,
                path: path,
                domain: DynamicForm.options.cookie_domain
            });
        }
    },
    Read: function(name) {
        if (typeof name === "undefined" || name === '') {
            return DynamicForm.constants.UNAVAILABLE;
        } else {
            return $.cookie(name);
        }
    },
    Delete: function(name) {
        if (typeof name === "undefined" || name === '') {
            return;
        } else {
            $.removeCookie(name);
        }
    }
}

DynamicForm.constants = {
    URL: {
        FORM_SUBMIT: (document.location.protocol === 'https:' ? 'https://secure' : 'http://now') + '.eloqua.com/e/f2.aspx',
        ELQ_LOOKUP: (document.location.protocol === 'https:' ? 'https://secure' : 'http://now') + '.eloqua.com/visitor/v200/svrGP.aspx',
        ELQ_LOOKUP_PROXY: "//elqproxy-theharris.rhcloud.com/elqLookup.php"
    },
    UNAVAILABLE: 'UNAVAILABLE',
    CONTAINER: '#GatedFormContainer',
    ELQ_FORM_NAME: 'RespondedToCampaign',
    MAX_RETRIES: 5,
    RETRY_WAIT: 1,
    STATUS_OK: '0',
    STATUS_WORKING: '1',
    T_FULL: '0',
    T_EMBEDDED: '1',
    //views
    V_FORM: 'Form',
    V_AUTO: 'Autosubmit',
    V_THANKS: 'Download',
    V_MULTIPLE: 'Multiple',
    V_BAD_OFFER: 'BadOffer',
    V_SEND_MSG: 'SendMsg',
    OMNITURE: {
        DIVIDER: ' | ',
        CHANNEL: {
            LANDING: 'landing page',
            LIGHTBOX: 'lightbox'
        },
        EVENT: {
            PAGE_LOAD: 'event17',
            FORM_SUBMIT: 'event18',
            INTCMP: 'event31'
        },
        FIRST_MINOR_SECTION: 'dynamic form',
        SECOND_MINOR_SECTION: {
            LIGHTBOX: 'lightbox',
            EMBEDDED: 'embedded'
        },
        INTERFACE: {
            FORM: 'form',
            AUTO: 'autosubmit',
            KNOWN: 'known',
            UNKNOWN: 'unknown',
            GATED: 'gated',
            TRACKED: 'tracked',
            UDF: 'udf'
        }
    }
};
DynamicForm.Prepop = {
    visitor: {},
    contact: {},
    tactic: {},
    offer: {}
};
DynamicForm.options = {
    updated_offer_id: '',
    offer_id: '1',
    cookie_domain: '.redhat.com',
    URL_PREFIX: (document.location.protocol === 'https:' ? 'https://' : 'http://') + 'www.redhat.com',
    debug: true,
    GoogleAnalyticsID: DynamicForm.constants.UNAVAILABLE,
    GoogleRemarketing: {
        id: "90030321",
        language: "en",
        format: "3",
        color: "ffffff",
        label: "rxV4CN_35QQQ8dOK2AM",
        value: "0"
    },
    GoogleAdWordsConversionTracking: {
        id: null,
        language: "en",
        format: "3",
        color: "ffffff",
        label: null,
        value: "0"
    },
    social: {
        google: {
            url: '//plus.google.com/+RedHat',
            label: 'Add us on Google+'
        },
        twitter: {
            url: '//www.twitter.com/redhatnews',
            label: 'Follow us on Twitter'
        },
        linkedin: {
            url: '//www.linkedin.com/groups?home=&gid=2525539&trk=anet_ug_hm',
            label: 'Connect on LinkedIn'
        },
        facebook: {
            url: '//www.facebook.com/redhatinc',
            label: 'Friend us on Facebook'
        }
    },
    language: '',
    queryString: [],
    view: '0',
    type: '0',
    VisitorLookupRetryCount: 0,
    ContactLookupRetryCount: 0,
    TacticLookupRetryCount: 0,
    OfferLookupRetryCount: 0,
    ElqGuidLookupRetryCount: 0,
    FormTitle: 'Download the Whitepaper',
    FormIntro: 'Register to access all of the assets in our Resource Library and to receive a set of informational emails customized to your interests.',
    FormPrivacyURL: '/footer/privacy-policy.html',
    ThanksTitle: 'Your content is ready!',
    ThanksCallToAction: 'Get It Now',
    ThanksText: 'Thank you for your interest in Red Hat. Your information has been submitted successfully!',
    ThanksButton: true
};
DynamicForm.views = {
    error: {
        title: "Oops!",
        text: "<p>We can't find the page you requested.</p><p>We recently redesigned our website to make it easier for you to find what you need. Obviously we still have some work to do.</p><p>Want to help us improve our website?</p><p>We've automatically logged this error and sent it to our web team. But we'd also appreciate a message from you telling us about your experience in your own words. Your contribution and <a href='/contact/web-feedback.html'>feedback</a> are important to us. Thanks for helping make our site better—both for you and the rest of the Red Hat community. That's the open source way!"
    },
    form: {
        'method': 'post',
        'cls': 'hidden',
        'id': 'RespondedToCampaign',
        'name': 'RespondedToCampaign',
        'fieldset': [{
            'type': 'hidden',
            'id': 'elqFormName',
            'name': 'elqFormName',
            'value': 'RespondedToCampaign'
        }, {
            'type': 'hidden',
            'id': 'elqSiteID',
            'name': 'elqSiteID'
        }, {
            'type': 'hidden',
            'id': 'A_ElqVisitorGuid',
            'name': 'A_ElqVisitorGuid'
        }, {
            'type': 'hidden',
            'id': 'elqCustomerGUID',
            'name': 'elqCustomerGUID'
        }, {
            'type': 'hidden',
            'id': 'C_Addition_Information1',
            'name': 'C_Addition_Information1'
        }, {
            'type': 'hidden',
            'id': 'A_Timestamp',
            'name': 'A_Timestamp'
        }, {
            'type': 'hidden',
            'id': 'A_SubmissionID',
            'name': 'A_SubmissionID'
        }, {
            'type': 'hidden',
            'id': 'A_LandingPageURL',
            'name': 'A_LandingPageURL'
        }, {
            'type': 'hidden',
            'id': 'V_MostRecentReferrer',
            'name': 'A_ReferringPageURL'
        }, {
            'type': 'hidden',
            'id': 'V_MostRecentSearchEngine',
            'name': 'A_MostRecentSearchEngine'
        }, {
            'type': 'hidden',
            'id': 'V_MostRecentSearchQuery',
            'name': 'A_MostRecentSearchQuery'
        }, {
            'type': 'hidden',
            'id': 'A_RedirectURL',
            'name': 'A_RedirectURL'
        }, {
            'type': 'hidden',
            'id': 'Apps_Offers_O_Campaign_ID_181',
            'name': 'A_OfferID'
        }, {
            'type': 'hidden',
            'id': 'A_PartnerID',
            'name': 'A_PartnerID'
        }, {
            'type': 'hidden',
            'id': 'A_VerificationID',
            'name': 'A_VerificationID'
        }, {
            'type': 'hidden',
            'id': 'Apps_Offers_O_Campaign_Name1',
            'name': 'A_OfferDetails_CampaignName'
        }, {
            'type': 'hidden',
            'id': 'Apps_Offers_O_Type1',
            'name': 'A_OfferDetails_Type'
        }, {
            'type': 'hidden',
            'id': 'Apps_Offers_O_Solution_Code1',
            'name': 'A_OfferDetails_SolutionCode'
        }, {
            'type': 'hidden',
            'id': 'Apps_Offers_O_Buying_Stage1',
            'name': 'A_OfferDetails_BuyingStage'
        }, {
            'type': 'hidden',
            'id': 'Apps_Offers_O_Target_Persona1',
            'name': 'A_OfferDetails_TargetPersona'
        }, {
            'type': 'hidden',
            'id': 'Apps_Offers_O_Asset_URL1',
            'name': 'A_OfferDetails_AssetURL'
        }, {
            'type': 'hidden',
            'id': 'A_TacticID_Internal',
            'name': 'A_TacticID_Internal'
        }, {
            'type': 'hidden',
            'id': 'Apps_Tactics_T_Campaign_ID_181',
            'name': 'A_TacticID_External'
        }, {
            'type': 'hidden',
            'id': 'Apps_Tactics_T_Campaign_Name1',
            'name': 'A_TacticDetails_CampaignName'
        }, {
            'type': 'hidden',
            'id': 'Apps_Tactics_T_Type1',
            'name': 'A_TacticDetails_Type'
        }, {
            'type': 'hidden',
            'id': 'V_CityFromIP',
            'name': 'V_CityFromIP'
        }, {
            'type': 'hidden',
            'id': 'V_CountryFromIP',
            'name': 'V_CountryFromIP'
        }, {
            'type': 'hidden',
            'id': 'V_ProvinceFromIP',
            'name': 'V_ProvinceFromIP'
        }, {
            'type': 'hidden',
            'id': 'V_ZipCodeFromIP',
            'name': 'V_ZipCodeFromIP'
        }, {
            'type': 'hidden',
            'id': 'V_Browser_Type',
            'name': 'V_Browser_Type'
        }, {
            'type': 'hidden',
            'id': 'A_UX_Type',
            'name': 'A_UX_Type',
            'value': 'Long Form'
        }, {
            'type': 'hidden',
            'id': 'A_UX_Language',
            'name': 'A_UX_Language'
        }, {
            'type': 'hidden',
            'id': 'A_UX_Browser',
            'name': 'A_UX_Browser',
            'value': window.navigator.userAgent
        }, {
            'type': 'hidden',
            'id': 'QA_Version',
            'name': 'QA_Version'
        }, {
            'type': 'hidden',
            'value': '',
            'id': 'QA_Ruaspambot',
            'name': 'QA_Ruaspambot'
        }, {
            'type': 'hidden',
            'value': '',
            'id': 'QA_Imatestrecord',
            'name': 'QA_Imatestrecord'
        }, {
            'type': 'hidden',
            'id': 'DB_DUNS_Number',
            'name': 'DB_DUNS_Number'
        }, {
            'type': 'hidden',
            'id': 'DB_Annual_Revenue',
            'name': 'DB_Annual_Revenue'
        }, {
            'type': 'hidden',
            'id': 'DB_State_Prov',
            'name': 'DB_State_Prov'
        }, {
            'type': 'hidden',
            'id': 'DB_Zip_Postal',
            'name': 'DB_Zip_Postal'
        }, {
            'type': 'hidden',
            'id': 'DB_Country',
            'name': 'DB_Country'
        }, {
            'type': 'hidden',
            'id': 'DB_Audience',
            'name': 'DB_Audience'
        }, {
            'type': 'hidden',
            'id': 'DB_Audience_Segment',
            'name': 'DB_Audience_Segment'
        }, {
            'type': 'hidden',
            'id': 'DB_Industry',
            'name': 'DB_Industry'
        }, {
            'type': 'hidden',
            'id': 'DB_Employee_Band',
            'name': 'DB_Employee_Band'
        }, {
            'type': 'hidden',
            'id': 'DB_DemandBaseID',
            'name': 'DB_DemandBaseID'
        }, {
            'type': 'hidden',
            'id': 'DB_Fortune1000',
            'name': 'DB_Fortune1000'
        }, {
            'type': 'hidden',
            'id': 'DB_Marketing_Alias',
            'name': 'DB_Marketing_Alias'
        }, {
            'type': 'hidden',
            'id': 'DB_Employee_Count',
            'name': 'DB_Employee_Count'
        }, {
            'type': 'hidden',
            'id': 'DB_Annual_Sales',
            'name': 'DB_Annual_Sales'
        }, {
            'type': 'hidden',
            'id': 'DB_Website',
            'name': 'DB_Website'
        }, {
            'type': 'hidden',
            'id': 'DB_Primary_SIC',
            'name': 'DB_Primary_SIC'
        }, {
            'type': 'hidden',
            'id': 'DB_IP',
            'name': 'DB_IP'
        }, {
            'cls': 'input-block-level required',
            'id': 'C_FirstName',
            'value': '',
            'name': 'C_FirstName',
            'type': 'text',
            'label': {
                'input_target': 'C_FirstName',
                'text': 'First Name'
            }
        }, {
            'label': {
                'input_target': 'C_LastName',
                'text': 'Last Name'
            },
            'name': 'C_LastName',
            'id': 'C_LastName',
            'value': '',
            'cls': 'input-block-level required',
            'type': 'text'
        }, {
            'label': {
                'input_target': 'C_EmailAddress',
                'text': 'Email'
            },
            'name': 'C_EmailAddress',
            'id': 'C_EmailAddress',
            'value': '',
            'cls': 'input-block-level required',
            'type': 'email'
        }, {
            'label': {
                'input_target': 'C_BusPhone',
                'text': 'Phone'
            },
            'name': 'C_BusPhone',
            'id': 'C_BusPhone',
            'value': ' ',
            'cls': 'input-block-level required',
            'type': 'text'
        }, {
            'label': {
                'input_target': 'C_Company',
                'text': 'Company'
            },
            'name': 'C_Company',
            'id': 'C_Company',
            'cls': 'input-block-level required',
            'type': 'text'
        }, {
            'label': {
                'input_target': 'C_Department1',
                'text': 'Department'
            },
            'type': 'select',
            'value': '',
            'name': 'C_Department1',
            'id': 'C_Department1',
            'cls': 'input-block-level required',
            'options': ['-- Please Select --', 'IT - Applications / Development', 'IT - Business Intelligence', 'IT - Database', 'IT - Desktop / Help Desk', 'IT - Network', 'IT - Operations', 'IT - Project Management', 'IT - Quality / Testing', 'IT - Risk / Compliance / Security', 'IT - Server / Storage', 'IT - Telecom', 'IT - Web', 'IT - All', 'Customer Service / Call Center', 'Executive Office', 'Finance', 'Human Resources', 'Legal', 'Marketing Communications', 'Research &amp; Development', 'Sales', 'Technical Support', 'Other']
        }, {
            'label': {
                'input_target': 'C_Job_Role11',
                'text': 'Job Title'
            },
            'type': 'select',
            'name': 'C_Job_Role11',
            'id': 'C_Job_Role11',
            'cls': 'input-block-level required',
            'value': '',
            'options': ['-- Please Select --']
        }]
    }
};
/* Eloqua Lookup Keys

Sandbox:
Data Lookup Name: GOTEpM - Get Visitor Profile
Data Lookup Key: 0374d03e-b989-40a0-a61c-0aa0e69c73ff

Data Lookup Name: GOTEpM - Get Contact Profile
Data Lookup Key: 5ca52786-22d8-4b0a-b169-c4811e7a421e

Data Lookup Name: GOTEpM - Get Offer Details
Data Lookup Key: f82ba5ae-2d05-4444-ad38-fbf7736752ec

Data Lookup Name: GOTEpM - Get Tactic Details
Data Lookup Key: 101a71d4-968d-4f35-9120-26cb438f73bd

Production:
Data Lookup Name: GOTEpM - Get Visitor Profile
Data Lookup Key: 14c651bb-beae-4f74-a382-d1adede85da0

Data Lookup Name: GOTEpM - Get Contact Profile
Data Lookup Key: af62a316-6489-4a86-b35e-0b5956fcb3a4

Data Lookup Name: GOTEpM - Get Offer Details
Data Lookup Key: b68eb5c2-6b22-40b6-bdb6-cba3f848b1c4

Data Lookup Name: GOTEpM - Get Tactic Details
Data Lookup Key: 6964661e-603a-4f93-8e13-07467544315b
*/
DynamicForm._LocalSettings = {
    debug: true,
    cookie_domain: '.redhat.local',
    URL_PREFIX: (document.location.protocol === 'https:' ? 'https://' : 'http://') + 'redhat.local',
    elqSiteId: '1798',
    QA_Version: "1.8.7 LOCAL",
    fields: {
        visitor: ['V_Browser_Type', 'V_CityFromIP', 'V_CountryFromIP', 'V_ProvinceFromIP', 'V_ZipCodeFromIP', 'V_MostRecentReferrer', 'V_MostRecentSearchEngine', 'V_MostRecentSearchQuery'],
        contact: ['C_FirstName', 'C_LastName', 'C_EmailAddress', 'C_BusPhone', 'C_Company', 'C_Department1', 'C_Job_Role11'],
        tactic: ['Apps_Tactics_T_Type1', 'Apps_Tactics_T_Campaign_ID_181', 'Apps_Tactics_T_Record_Type1', 'Apps_Tactics_T_Campaign_Name1'],
        offer: ['Apps_Offers_O_Access_Rule1', 'Apps_Offers_O_Campaign_ID_181', 'Apps_Offers_O_Campaign_Name1', 'Apps_Offers_O_Target_Persona1', 'Apps_Offers_O_Buying_Stage1', 'Apps_Offers_O_Solution_Code1', 'Apps_Offers_O_Type1', 'Apps_Offers_O_Asset_URL1', 'Apps_Offers_O_Language1', 'Apps_Offers_O_Record_Type1', 'isOnWaitingList']
    },
    lookup: {
        visitor: {
            key: '0374d03e-b989-40a0-a61c-0aa0e69c73ff',
            lookupFunc: 'visitor',
            fields: {
                countryFromIp: 'V_CountryFromIP',
                stateFromIp: 'V_ProvinceFromIP',
                zipFromIp: 'V_ZipCodeFromIP',
                elqEmail: 'V_ElqEmailAddress',
                email: 'V_Email_Address',
                mostRecentReferrer: 'V_MostRecentReferrer',
                mostRecentSearchEngine: 'V_MostRecentSearchEngine',
                mostRecentSearchQuery: 'V_MostRecentSearchQuery'
            }
        },
        contact: {
            key: '5ca52786-22d8-4b0a-b169-c4811e7a421e',
            query: 'C_EmailAddress',
            lookupFunc: 'contact',
            fields: {
                email: 'C_EmailAddress',
                salutation: 'C_Salutation',
                firstName: 'C_FirstName',
                lastName: 'C_LastName',
                hasRegistered: 'C_Has_Submitted_Long_Form21',
                registeredDate: 'C_GS___Gated_Form___Register_Date1',
                company: 'C_Company',
                role: 'C_Job_Role11',
                department: 'C_Department1',
                country: 'C_Country',
                state: 'C_State_Prov',
                zip: 'C_Zip_Postal',
                language: 'C_Language_Preference1',
                verificationid: 'C_Verification_ID___Most_Recent1'
            }
        },
        tactic: {
            key: '101a71d4-968d-4f35-9120-26cb438f73bd',
            query: 'Apps_Tactics_T_Campaign_ID_181',
            lookupFunc: 'tactic',
            fields: {
                campaignId15: 'Apps_Tactics_T_Campaign_ID_151',
                campaignId18: 'Apps_Tactics_T_Campaign_ID_181',
                campaignName: 'Apps_Tactics_T_Campaign_Name1',
                type: 'Apps_Tactics_T_Type1',
                recordType: 'Apps_Tactics_T_Record_Type1',
                isOnWaitingList: 'isOnWaitingList'
            }
        },
        offer: {
            key: 'f82ba5ae-2d05-4444-ad38-fbf7736752ec',
            query: 'Apps_Offers_O_Campaign_ID_181',
            lookupFunc: 'offer',
            fields: {
                offerId15: 'Apps_Offers_O_Campaign_ID_151',
                offerId18: 'Apps_Offers_O_Campaign_ID_181',
                campaignName: 'Apps_Offers_O_Campaign_Name1',
                targetAudience: 'Apps_Offers_O_Target_Persona1',
                buyerStage: 'Apps_Offers_O_Buying_Stage1',
                solutionCode: 'Apps_Offers_O_Solution_Code1',
                type: 'Apps_Offers_O_Type1',
                assetUrl: 'Apps_Offers_O_Asset_URL1',
                language: 'Apps_Offers_O_Language1',
                recordType: 'Apps_Offers_O_Record_Type1',
                isOnWaitingList: 'isOnWaitingList',
                accessrule: 'Apps_Offers_O_Access_Rule1'
            }
        }
    }
};
DynamicForm._DevSettings = {
    debug: true,
    URL_PREFIX: (document.location.protocol === 'https:' ? 'https://' : 'http://') + 'cms-300.usersys.redhat.com',
    elqSiteId: '1798',
    QA_Version: "1.8.7 CMS-300",
    fields: {
        visitor: ['V_Browser_Type', 'V_CityFromIP', 'V_CountryFromIP', 'V_ProvinceFromIP', 'V_ZipCodeFromIP', 'V_MostRecentReferrer', 'V_MostRecentSearchEngine', 'V_MostRecentSearchQuery'],
        contact: ['C_FirstName', 'C_LastName', 'C_EmailAddress', 'C_BusPhone', 'C_Company', 'C_Department1', 'C_Job_Role11'
            /*,
            'C_Addition_Information1'*/
        ],
        tactic: ['Apps_Tactics_T_Type1', 'Apps_Tactics_T_Campaign_ID_181', 'Apps_Tactics_T_Record_Type1', 'Apps_Tactics_T_Campaign_Name1'],
        offer: ['Apps_Offers_O_Access_Rule1', 'Apps_Offers_O_Campaign_ID_181', 'Apps_Offers_O_Campaign_Name1', 'Apps_Offers_O_Target_Persona1', 'Apps_Offers_O_Buying_Stage1', 'Apps_Offers_O_Solution_Code1', 'Apps_Offers_O_Type1', 'Apps_Offers_O_Asset_URL1', 'Apps_Offers_O_Language1', 'Apps_Offers_O_Record_Type1', 'isOnWaitingList']
    },
    lookup: {
        visitor: {
            key: '0374d03eb98940a0a61c0aa0e69c73ff',
            lookupFunc: 'visitor',
            fields: {
                countryFromIp: 'V_CountryFromIP',
                stateFromIp: 'V_ProvinceFromIP',
                zipFromIp: 'V_ZipCodeFromIP',
                elqEmail: 'V_ElqEmailAddress',
                email: 'V_Email_Address',
                mostRecentReferrer: 'V_MostRecentReferrer',
                mostRecentSearchEngine: 'V_MostRecentSearchEngine',
                mostRecentSearchQuery: 'V_MostRecentSearchQuery'
            }
        },
        contact: {
            key: '5ca5278622d84b0ab169c4811e7a421e',
            query: 'C_EmailAddress',
            lookupFunc: 'contact',
            fields: {
                email: 'C_EmailAddress',
                salutation: 'C_Salutation',
                firstName: 'C_FirstName',
                lastName: 'C_LastName',
                hasRegistered: 'C_Has_Submitted_Long_Form21',
                registeredDate: 'C_GS___Gated_Form___Register_Date1',
                company: 'C_Company',
                role: 'C_Job_Role11',
                department: 'C_Department1',
                country: 'C_Country',
                state: 'C_State_Prov',
                zip: 'C_Zip_Postal',
                language: 'C_Language_Preference1',
                verificationid: 'C_Verification_ID___Most_Recent1'
            }
        },
        tactic: {
            key: '101a71d4968d4f35912026cb438f73bd',
            query: 'Apps_Tactics_T_Campaign_ID_181',
            lookupFunc: 'tactic',
            fields: {
                campaignId15: 'Apps_Tactics_T_Campaign_ID_151',
                campaignId18: 'Apps_Tactics_T_Campaign_ID_181',
                campaignName: 'Apps_Tactics_T_Campaign_Name1',
                type: 'Apps_Tactics_T_Type1',
                recordType: 'Apps_Tactics_T_Record_Type1',
                isOnWaitingList: 'isOnWaitingList'
            }
        },
        offer: {
            key: 'f82ba5ae2d054444ad38fbf7736752ec',
            query: 'Apps_Offers_O_Campaign_ID_181',
            lookupFunc: 'offer',
            fields: {
                offerId15: 'Apps_Offers_O_Campaign_ID_151',
                offerId18: 'Apps_Offers_O_Campaign_ID_181',
                campaignName: 'Apps_Offers_O_Campaign_Name1',
                targetAudience: 'Apps_Offers_O_Target_Persona1',
                buyerStage: 'Apps_Offers_O_Buying_Stage1',
                solutionCode: 'Apps_Offers_O_Solution_Code1',
                type: 'Apps_Offers_O_Type1',
                assetUrl: 'Apps_Offers_O_Asset_URL1',
                language: 'Apps_Offers_O_Language1',
                recordType: 'Apps_Offers_O_Record_Type1',
                isOnWaitingList: 'isOnWaitingList',
                accessrule: 'Apps_Offers_O_Access_Rule1'
            }
        }
    }
};
DynamicForm._StageSettings = {
    debug: false,
    URL_PREFIX: (document.location.protocol === 'https:' ? 'https://' : 'http://') + 'stage.redhat.com',
    QA_Version: "1.8.7 STAGE",
};
DynamicForm._ProdSettings = {
    no_css: false,
    debug: false,
    URL_PREFIX: (document.location.protocol === 'https:' ? 'https://' : 'http://') + 'redhat.com',
    QA_Version: "1.8.7",
    elqSiteId: '1795',
    fields: {
        visitor: ['V_Browser_Type', 'V_CityFromIP', 'V_CountryFromIP', 'V_ProvinceFromIP', 'V_ZipCodeFromIP', 'V_MostRecentReferrer', 'V_MostRecentSearchEngine', 'V_MostRecentSearchQuery'],
        contact: ['C_FirstName', 'C_LastName', 'C_EmailAddress', 'C_BusPhone', 'C_Company', 'C_Department1', 'C_Job_Role11'
            /*,
            'C_Addition_Information1'*/
        ],
        tactic: ['Apps_Tactics_T_Type1', 'Apps_Tactics_T_Campaign_ID_181', 'Apps_Tactics_T_Record_Type1', 'Apps_Tactics_T_Campaign_Name1'],
        offer: ['Apps_Offers_O_Access_Rule1', 'Apps_Offers_O_Campaign_ID_181', 'Apps_Offers_O_Campaign_Name1', 'Apps_Offers_O_Target_Persona1', 'Apps_Offers_O_Buying_Stage1', 'Apps_Offers_O_Solution_Code1', 'Apps_Offers_O_Type1', 'Apps_Offers_O_Asset_URL1', 'Apps_Offers_O_Language1', 'Apps_Offers_O_Record_Type1', 'isOnWaitingList']
    },
    lookup: {
        visitor: {
            key: '14c651bb-beae-4f74-a382-d1adede85da0',
            fields: {
                countryFromIp: 'V_CountryFromIP',
                stateFromIp: 'V_ProvinceFromIP',
                zipFromIp: 'V_ZipCodeFromIP',
                email: 'V_Email_Address',
                mostRecentReferrer: 'V_MostRecentReferrer',
                mostRecentSearchEngine: 'V_MostRecentSearchEngine',
                mostRecentSearchQuery: 'V_MostRecentSearchQuery'
            }
        },
        contact: {
            key: 'af62a316-6489-4a86-b35e-0b5956fcb3a4',
            query: 'C_EmailAddress',
            fields: {
                email: 'C_EmailAddress',
                salutation: 'C_Salutation',
                firstName: 'C_FirstName',
                lastName: 'C_LastName',
                hasRegistered: 'C_Has_Submitted_Long_Form1',
                registeredDate: 'C_Last_Submitted_Long_Form_Date1',
                company: 'C_Company',
                role: 'C_Job_Role11',
                department: 'C_Department1',
                country: 'C_Country',
                state: 'C_State_Prov',
                zip: 'C_Zip_Postal',
                language: 'C_Language_Preference1',
                verificationid: 'C_Verification_ID___Most_Recent1'
            }
        },
        tactic: {
            key: '6964661e-603a-4f93-8e13-07467544315b',
            query: 'Apps_Tactics_T_Campaign_ID_181',
            fields: {
                campaignId15: 'Apps_Tactics_T_Campaign_ID_151',
                campaignId18: 'Apps_Tactics_T_Campaign_ID_181',
                campaignName: 'Apps_Tactics_T_Campaign_Name1',
                type: 'Apps_Tactics_T_Type1',
                recordType: 'Apps_Tactics_T_Record_Type1',
                isOnWaitingList: 'isOnWaitingList'
            }
        },
        offer: {
            key: 'b68eb5c2-6b22-40b6-bdb6-cba3f848b1c4',
            query: 'Apps_Offers_O_Campaign_ID_181',
            fields: {
                offerId15: 'Apps_Offers_O_Campaign_ID_151',
                offerId18: 'Apps_Offers_O_Campaign_ID_181',
                campaignName: 'Apps_Offers_O_Campaign_Name1',
                targetAudience: 'Apps_Offers_O_Target_Persona1',
                buyerStage: 'Apps_Offers_O_Buying_Stage1',
                solutionCode: 'Apps_Offers_O_Solution_Code1',
                type: 'Apps_Offers_O_Type1',
                assetUrl: 'Apps_Offers_O_Asset_URL1',
                language: 'Apps_Offers_O_Language1',
                recordType: 'Apps_Offers_O_Record_Type1',
                isOnWaitingList: 'isOnWaitingList',
                accessrule: 'Apps_Offers_O_Access_Rule1'
            }
        }
    }
};

DynamicForm.log = function() {
    if (!DynamicForm.options.debug) {
        return;
    }
    var msg = '[DynamicForm.log] ' + Array.prototype.join.call(arguments, '');
    if (window.console && window.console.log) {
        window.console.log(msg);
    } else if (window.opera && window.opera.postError) {
        window.opera.postError(msg);
    }
};

DynamicForm.info = function(src, obj) {
    if (!DynamicForm.options.debug) {
        return;
    }
    if (window.console && window.console.log) {
        window.console.info("[DynamicForm info] ",src,": ", obj);
    } else if (window.opera && window.opera.postError) {
        window.opera.postError("[DynamicForm info] ",src,": ", obj);
    }
};

DynamicForm.error = function(src, e) {
    if (!DynamicForm.options.debug) {
        return;
    }
    if (window.console && window.console.log) {
        window.console.error("[DynamicForm ERROR] ",src," e: ", e);
    } else if (window.opera && window.opera.postError) {
        window.opera.postError("[DynamicForm ERROR] ",src," e: ", e);
    }
};


DynamicForm.InitOptions = function(opts) {
    var params = $.url(document.URL).param();
    $.extend(DynamicForm.options, opts, params);

    DynamicForm.options._ms = new Date().getMilliseconds();
    DynamicForm.options.FormURL = document.URL;

    //Set up environment
    $.extend(DynamicForm.options, opts, DynamicForm._LocalSettings);

    //update configure options with query string parameters
    var config_options = ['v', 'language', 'country', 'sc_cid', 'intcmp', 'pid', 'offer_id', 'GoogleAnalyticsID', 'no_css'];
    for (var opt in config_options) {
        if (DynamicForm.CheckValue($.url(document.URL).param(opt))) {
            DynamicForm.options[opt] = $.url(document.URL).param(opt);
        }
    }

    if (DynamicForm.CheckValue(DynamicForm.options.udf) && DynamicForm.ValueIsEmpty(DynamicForm.options.CustomQuestions)) {
        DynamicForm.options.CustomQuestions = DynamicForm.options.udf;
    }

    if (DynamicForm.CheckValue(DynamicForm.options.rh_omni_itc) && DynamicForm.ValueIsEmpty(DynamicForm.options.intcmp)) {
        DynamicForm.options.intcmp = DynamicForm.options.rh_omni_itc;
    }

    if (DynamicForm.CheckValue(DynamicForm.options.rh_omni_tc) && DynamicForm.ValueIsEmpty(DynamicForm.options.sc_cid)) {
        DynamicForm.options.sc_cid = DynamicForm.options.rh_omni_tc;
    }
};

DynamicForm.start = function(opts) {
    DynamicForm.ShowLoadingMsg("Please wait...");

    DynamicForm.Tracking.DemandBaseRemarketing.Trigger();
    DynamicForm.Tracking.GoogleRemarketing.Trigger();

    DynamicForm.InitOptions(opts);

    DynamicForm.Cookies.Process();

    var view = DynamicForm.options.v || DynamicForm.constants.V_FORM;

    DynamicForm.elqTracker = new $.elq(DynamicForm.options.elqSiteId);
    $.fn.elqTrack(DynamicForm.options.elqSiteId);

    if (DynamicForm.options.no_css) {
        $('head link[href*="gatedform"]').detach();
    }

    var DynamicFormLookupInit;

    if (view === DynamicForm.constants.V_SEND_MSG) {
        return DynamicForm.Thanks.message(DynamicForm.options);
        DynamicFormLookupInit = null;
    } else {
        DynamicFormLookupInit = DynamicForm.Lookup.All();
    }

    var DynamicFormInitDef = new $.Deferred();

    $.when(DynamicFormLookupInit).then(function() {
        var container = $(DynamicForm.constants.CONTAINER);

        //stuff we can tell from here:
        // 0. Default to Form view
        // 1. Check if there is a 'container' object on the page
        //      This decides if it's an in-line form or a multiple offer/CMS page
        // 2. Look for Query String Parameters
        //      Specified view destination can be sent along
        if (container.length < 1 && view !== DynamicForm.constants.V_SEND_MSG) {
            view = DynamicForm.constants.V_MULTIPLE;
        }

        DynamicForm.options.type = DynamicForm.constants.T_FULL;
        if (DynamicForm.options.view !== DynamicForm.constants.V_SEND_MSG && DynamicForm.options.view !== DynamicForm.constants.V_THANKS) {
            DynamicForm.ShowLoadingMsg();
            try {
                if (top === self) {
                    DynamicForm.options.type = DynamicForm.constants.T_EMBEDDED;
                } else {
                    DynamicForm.options.type = DynamicForm.constants.T_FULL;
                }
            } catch (e) {
                DynamicForm.options.type = DynamicForm.constants.T_FULL;
            }
        }

        switch (view) {
            case DynamicForm.constants.V_SEND_MSG:
                //send to auto submit

                break;
            case DynamicForm.constants.V_THANKS:
                //send to auto submit
                if (DynamicForm.options.view !== DynamicForm.constants.V_MULTIPLE) {
                    if (typeof DynamicForm.options.CustomQuestions !== 'undefined' && DynamicForm.options.CustomQuestions.length > 0) {
                        view = DynamicForm.constants.V_FORM;
                        DynamicForm.options.form_type = 'form';
                        DynamicFormInitDef = DynamicForm.Thanks.start(DynamicForm.options);
                    } else {
                        view = DynamicForm.constants.V_FORM;
                        DynamicForm.options.form_type = 'form';
                        DynamicFormInitDef = DynamicForm.Form.start(DynamicForm.options);
                    }
                }
                break;
            case DynamicForm.constants.V_FORM:
                DynamicFormInitDef = DynamicForm.Form.start(DynamicForm.options);
                break;
            case DynamicForm.constants.V_MULTIPLE:
                DynamicFormInitDef = DynamicForm.MultipleOffers.start(DynamicForm.options);
                break;
            case DynamicForm.constants.V_BAD_OFFER:
                DynamicFormInitDef = DynamicForm.BadOffer.start(DynamicForm.options);
                break;
        }

        DynamicForm.options.loaded = true;
    });

    return DynamicFormInitDef;
};

DynamicForm.GetFormURL = function() {
    return DynamicForm.options.FormURL;
};

DynamicForm.ShowLoadingMsg = function(msg) {
    var topOffset = 200;

    if (typeof $(DynamicForm.constants.CONTAINER).offset() === 'function') {
        topOffset = $(DynamicForm.constants.CONTAINER).offset().top - 40
    }

    $('html, body').stop().animate({
        scrollTop: topOffset
    }, 'slow');


    DynamicForm.HideLoadingMsg();

    var message = msg || "Please wait...",
        $form = $('#' + DynamicForm.constants.ELQ_FORM_NAME),
        $container = $(DynamicForm.constants.CONTAINER),
        imgUrl = DynamicForm.options.URL_PREFIX + '/forms/img/spinner.gif';

    if ($form.length > 0) {
        $form.slideUp();
    }

    loadingMsg = '<div id="Loading" class="ajax-loader"><img src="' + imgUrl + '" alt="Loading" title="Loading" ><div class="muted" id="Progress">' + message + '</div></div>';
    $container.append(loadingMsg);
};

DynamicForm.HideLoadingMsg = function(newContent) {
    var topOffset = 200;

    if (typeof $(DynamicForm.constants.CONTAINER).offset() === 'function') {
        topOffset = $(DynamicForm.constants.CONTAINER).offset().top - 40
    }

    $('html, body').stop().animate({
        scrollTop: topOffset
    }, 'slow');

    $("#Loading").fadeOut().detach();
    $("#" + newContent).removeClass('hidden').slideDown();
    $('form:not(.filter) :input:visible:first').focus()
};
DynamicForm.CheckValue = function(value) {
    return !DynamicForm.ValueIsEmpty(value);
};
DynamicForm.ValueIsEmpty = function(value) {
    var valid = false;
    if (typeof value === 'undefined') {
        valid = true;
    } else if (value === DynamicForm.constants.UNAVAILABLE) {
        valid = true;
    } else if (value === '') {
        valid = true;
    }
    return valid;
};
DynamicForm.LoadScript = function(url, callback) {
    return $.getScript(url, function() {
        if (typeof callback === 'function') {
            callback();
        }
    });
};
DynamicForm.GetPartnerID = function() {
    var PartnerID = '';
    // 1. config
    if (DynamicForm.CheckValue(DynamicForm.options.pid)) {
        PartnerID = DynamicForm.options.pid;
    } else if (DynamicForm.CheckValue(DynamicForm.Cookies.Read('rh_pid'))) {
        // 2. No query string, since it would already be in the cookie
        // 3. cookie
        PartnerID = DynamicForm.Cookies.Read('rh_pid');
    }
    return PartnerID;
};

DynamicForm.GetSubDomain = function() {
    var sub = DynamicForm.constants.UNAVAILABLE;
    var hashes = document.domain.split('.');
    var prefix = hashes[0];
    if (prefix.length > 0 && prefix.length < 5) {
        sub = prefix;
    }
    return sub;
};

DynamicForm.GetLanguageCode = function(type) {
    var cookie_name = 'LOCALE';
    var cookieLanguage = DynamicForm.Cookies.Read(cookie_name);

    //TODO: www.redhat.com/<Language>/
    //TODO: fall back to other available options if bundle not found
    var language = 'en';
    //default
    //TODO: Verify locally and on cms-300 if possible
    if ($.url(document.URL)
        .param('language')) {
        language = $.url(document.URL)
            .param('language');
    } else if ($.url(document.URL)
        .param('Language')) {
        language = $.url(document.URL)
            .param('Language');
    } else if (DynamicForm.CheckValue(DynamicForm.options.language)) {
        language = DynamicForm.options.language;
    } else if (typeof cookieLanguage !== 'undefined' && cookieLanguage !== DynamicForm.constants.UNAVAILABLE) {
        language = cookieLanguage.substr(0, 2);
    } else if (DynamicForm.GetSubDomain() !== DynamicForm.constants.UNAVAILABLE) {
        language = DynamicForm.GetSubDomain();
    }
    return language;
};

DynamicForm.GetCountryCode = function(languageCode) {
    var cookie_name = 'LOCALE';
    var cookieLanguage = DynamicForm.Cookies.Read(cookie_name);
    //TODO: www.redhat.com/<Language>/
    var country = '';
    //default
    if ($.url(document.URL)
        .param('country')) {
        country = $.url(document.URL)
            .param('country');
    } else if ($.url(document.URL)
        .param('Country')) {
        country = $.url(document.URL)
            .param('Country');
    } else if (DynamicForm.CheckValue(DynamicForm.options.country)) {
        country = DynamicForm.options.country;
    } else if (typeof cookieLanguage !== 'undefined' && cookieLanguage !== DynamicForm.constants.UNAVAILABLE) {
        country = cookieLanguage.substr(3, 5);
    }
    return country;
};
DynamicForm.Template = {
    form: {
        validationMessages: '<div id="messages" class="fluid-row control-group"><div class="controls"><div id="validationMessages"></div></div></div>',
        end: '</fieldset></form>'
    },
    controlGroup: {
        start: '<div class="fluid-row control-group">',
        input: '<div class="controls">',
        end: '</div></div>'
    },
    /*TODO: functionality to replace text on landing page with content from LandingPage lookup
    ReplaceText : function(textObj) {
        $("#"+textObj.name).html(textObj.value);
    },
    */
    RenderField: function(fieldObj) {
        if (DynamicForm.ValueIsEmpty(fieldObj.value)) {
            fieldObj.value = '';
        }

        switch (fieldObj.type) {
            case 'hidden':
                DynamicForm.Template.formHtml = DynamicForm.Template.formHtml.concat('<input type="hidden" name="', fieldObj.name, '" id="', fieldObj.id, '" value="', fieldObj.value, '">');
                break;
            case 'text':
                //falls through
            case 'email':
                if (DynamicForm.options.form_type === 'autosubmit') {
                    DynamicForm.Template.formHtml = DynamicForm.Template.formHtml.concat('<input type="hidden" name="', fieldObj.name, '" id="', fieldObj.id, '" value="', fieldObj.value, '">');
                } else {
                    DynamicForm.Template.formHtml = DynamicForm.Template.formHtml.concat(DynamicForm.Template.controlGroup.start, '<label class="required control-label" for="', fieldObj.label.input_target, '">', fieldObj.label.text, '</label>', DynamicForm.Template.controlGroup.input, '<input type="' + fieldObj.type + '"  name="', fieldObj.name, '" id="', fieldObj.id, '" class="', fieldObj.cls, '" value="', fieldObj.value, '">', DynamicForm.Template.controlGroup.end);
                }
                break;
            case 'select':
                var optText;
                if (DynamicForm.options.form_type === 'autosubmit') {
                    DynamicForm.Template.formHtml = DynamicForm.Template.formHtml.concat('<input type="hidden" name="', fieldObj.name, '" id="', fieldObj.id, '" value="', fieldObj.value, '">');
                } else {
                    DynamicForm.Template.formHtml = DynamicForm.Template.formHtml.concat(DynamicForm.Template.controlGroup.start, '<label class="required control-label" for="', fieldObj.label.input_target, '">', fieldObj.label.text, '</label>', DynamicForm.Template.controlGroup.input);

                    if (fieldObj.updates_offer_id !== 'undefined' && (fieldObj.updates_offer_id === 'true')) {
                        DynamicForm.Template.formHtml = DynamicForm.Template.formHtml.concat('<select data-updates_offer_id="true" name="', fieldObj.name, '" id="', fieldObj.id, '" class="', fieldObj.cls, '">');
                    } else {
                        DynamicForm.Template.formHtml = DynamicForm.Template.formHtml.concat('<select name="', fieldObj.name, '" id="', fieldObj.id, '" class="', fieldObj.cls, '">');
                    }

                    for (var i in fieldObj.options) {
                        if (fieldObj.options.hasOwnProperty(i)) {
                            optText = fieldObj.options[i];

                            if (typeof optText === 'string') {
                                if (optText === "-- Please Select --") {
                                    DynamicForm.Template.formHtml = DynamicForm.Template.formHtml.concat('<option value="">', optText, '</option>,');
                                } else {
                                    DynamicForm.Template.formHtml = DynamicForm.Template.formHtml.concat('<option value="', optText, '">', optText, '</option>,');
                                }
                            } else if (typeof optText === 'object') {
                                DynamicForm.Template.formHtml = DynamicForm.Template.formHtml.concat('<option value="', optText.val, '">', optText.label, '</option>');
                            }

                        }
                    }
                    DynamicForm.Template.formHtml = DynamicForm.Template.formHtml.concat('</select>', DynamicForm.Template.controlGroup.end);
                }
                break;
            case 'button':
                //falls through
            case 'submit':
                if (DynamicForm.options.form_type !== 'autosubmit') {
                    DynamicForm.Template.formHtml = DynamicForm.Template.formHtml.concat('<div class="form-submit"><button name="', fieldObj.name, '" id="', fieldObj.id, '" class="', fieldObj.cls, '">', fieldObj.value, '</button></div>');
                }
                break;
        }
    },
    render: function(formObj) {
        var retHtml, question;
        formObj.cls = formObj.cls || '';
        if (DynamicForm.options.type === DynamicForm.constants.T_FULL) {
            formObj.cls += ' form-horizontal';
        } else {
            formObj.cls += ' scrolly-taller';
        }
        //reset formHTML, just in case...
        DynamicForm.Template.formHtml = '';
        DynamicForm.Template.formHtml = DynamicForm.Template.formHtml.concat('<iframe id="elqFormSubmitFrame" class="hidden" name="elqFormSubmitFrame" height="10" width="10"></iframe><form target="elqFormSubmitFrame" action="', formObj.action, '" method="', formObj.method, '" class="', formObj.cls, '" id="', formObj.id, '" name=', formObj.name, '"><fieldset>');

        if (DynamicForm.options.type === DynamicForm.constants.T_FULL) {
            DynamicForm.Template.formHtml = DynamicForm.Template.formHtml.concat('<header><img alt="Red Hat Logo" title="Red Hat Logo" src="' + DynamicForm.options.URL_PREFIX + '/forms/img/rh-logo103x36.png" height="36" width="103" class="rh-logo"><h4>', DynamicForm.options.FormTitle, '</h4></header>');
        } else if (DynamicForm.options.FormTitle !== "") {
            DynamicForm.Template.formHtml = DynamicForm.Template.formHtml.concat('<header><h4>', DynamicForm.options.FormTitle, '</h4></header>');
        }

        if (DynamicForm.options.FormIntro !== "") {
            DynamicForm.Template.formHtml = DynamicForm.Template.formHtml.concat('<div class="fluid-row form-message muted">' + DynamicForm.options.FormIntro + '</div>');
        }

        if (DynamicForm.CheckValue(formObj.action)) {
            formObj.action = DynamicForm.constants.URL.FORM_SUBMIT;
        }
        DynamicForm.Template.formHtml = DynamicForm.Template.formHtml.concat('<div id="messages" class="fluid-row control-group"><div class="controls"><div id="validationMessages"></div></div></div><div class="scrolly">');
        var i = 0;
        // 1. Base form fields
        var fields = formObj.fieldset;
        for (i = 0; i < fields.length; i++) {
            DynamicForm.Template.RenderField(fields[i]);
        }
        /*TODO: functionality to replace text on landing page with content from LandingPage lookup
        $.when(DynamicForm.Lookup.LandingPage()).then(function() {
			var contents = DynamicForm.LookupData.LandingPage();

            for ( i = 0; i < landingPageContent.length; i++) {
                DynamicForm.Template.ReplaceText(landingPageContent[i]);
            }
        });*/
        // 2. Optional UDF field(s)
        if (typeof DynamicForm.options.CustomQuestions !== 'undefined') {
            for (i = 0; i < DynamicForm.options.CustomQuestions.length; i++) {
                jQuery.validator.addClassRules("name", {
                    required: true,
                    minlength: 2
                });

                if (typeof DynamicForm.options.CustomQuestions[i] === 'string') {
                    DynamicForm.Template.RenderField({
                        'type': 'hidden',
                        'value': DynamicForm.options.CustomQuestions[i],
                        'id': 'UDF_0' + (i + 1) + '_Question',
                        'name': 'UDF_0' + (i + 1) + '_Question'
                    });
                    DynamicForm.Template.RenderField({
                        'label': {
                            'input_target': 'UDF_0' + (i + 1) + '_Answer',
                            'text': DynamicForm.options.CustomQuestions[i]
                        },
                        'type': 'text',
                        'name': 'UDF_0' + (i + 1) + '_Answer',
                        'id': 'UDF_0' + (i + 1) + '_Answer',
                        'cls': 'input-block-level required',
                        'value': ''
                    });
                } else if (typeof DynamicForm.options.CustomQuestions[i] === 'object') {
                    question = DynamicForm.options.CustomQuestions[i];
                    DynamicForm.Template.RenderField({
                        'type': 'hidden',
                        'value': question.label,
                        'id': 'UDF_0' + (i + 1) + '_Question',
                        'name': 'UDF_0' + (i + 1) + '_Question'
                    });

                    DynamicForm.Template.RenderField({
                        'update': DynamicForm.options.CustomQuestions[i].update || '',
                        'label': {
                            'input_target': 'UDF_0' + (i + 1) + '_Answer',
                            'text': question.label
                        },
                        'updates_offer_id': DynamicForm.options.CustomQuestions[i].updatesOfferId,
                        'type': 'select',
                        'name': 'UDF_0' + (i + 1) + '_Answer',
                        'id': 'UDF_0' + (i + 1) + '_Answer',
                        'cls': 'input-block-level required',
                        'value': '',
                        'options': question.options
                    });
                }
            }
        }

        DynamicForm.Template.formHtml = DynamicForm.Template.formHtml.concat('</div>');

        //3. Close and add button
        var ButtonObj = {
            'type': 'submit',
            'value': 'Continue',
            'name': 'FormSubmitButton',
            'id': 'FormSubmitButton',
            'cls': 'btn btn-block btn-large btn-danger'
        };
        DynamicForm.Template.RenderField(ButtonObj);
        DynamicForm.Template.formHtml = DynamicForm.Template.formHtml.concat('<footer class="container-fluid muted"><a href="', DynamicForm.options.FormPrivacyURL, '" target="_blank">Privacy Statement</a></footer>');
        if (typeof DynamicForm.Template.formHtml === 'undefined') {
            retHtml = DynamicForm.Template.formHtml;
        }
        return retHtml;
    },
    html: function() {
        var LoadHtmlDef = new $.Deferred(),
            html;
        if (typeof DynamicForm.Template.formHtml === 'undefined') {
            LoadHtmlDef = DynamicForm.Template.render(DynamicForm.views.form);
        } else {
            LoadHtmlDef.resolve();
        }

        $.when(LoadHtmlDef)
            .then(function() {
                html = DynamicForm.Template.formHtml;
            });
        $("#wrapper")
            .css("background", "transparent");

        return html;
    },
    ThankYou: {
        render: function(type) {
            //reset formHTML, just in case...
            var tmpHtml = '<div id="DynamicFormThankYou">';

            if (DynamicForm.options.ThanksTitle !== '' && typeof DynamicForm.options.ThanksTitle !== 'undefined') {
                if (DynamicForm.options.type === DynamicForm.constants.T_FULL) {
                    tmpHtml = tmpHtml.concat('<header><img alt="Red Hat Logo" title="Red Hat Logo" src="', DynamicForm.options.URL_PREFIX, '/forms/img/rh-logo103x36.png" height="36" width="103" class="rh-logo"><h4 class="thankyou">', DynamicForm.options.ThanksTitle, '</h4></header>');
                } else {
                    tmpHtml = tmpHtml.concat('<h4 class="thankyou">', DynamicForm.options.ThanksTitle, '</h4>');
                }
            }

            if (DynamicForm.options.ThanksCallToAction !== '' && typeof DynamicForm.options.ThanksCallToAction !== 'undefined') {
                if (DynamicForm.options.ThanksButton !== 'false') {
                    tmpHtml = tmpHtml.concat('<a href="', DynamicForm.LookupData.Offer(DynamicForm.options.lookup.offer.fields.assetUrl), '" class="btn btn-large btn-block btn-danger disabled elqSubmit" target="_blank" id="FormSubmitBtn">' + DynamicForm.options.ThanksCallToAction + '</a>');
                }
            }

            if (DynamicForm.options.ThanksText !== '' && typeof DynamicForm.options.ThanksText !== 'undefined') {
                tmpHtml = tmpHtml.concat('<p>', DynamicForm.options.ThanksText, '</p>');
            }

            tmpHtml = tmpHtml.concat('<small class="muted" id="VerificationID">Verification ID: ', DynamicForm.GetVerificationID(), '</small>');

            if (DynamicForm.options.type === DynamicForm.constants.T_FULL) {
                tmpHtml = tmpHtml.concat('<div class="social-links"><ul>', '<li><a href="', DynamicForm.options.social.google.url, '">', DynamicForm.options.social.google.label, ' <img src="' + DynamicForm.options.URL_PREFIX + '/forms/img/googleplus-icon.png"></a></li>', '<li><a href="', DynamicForm.options.social.twitter.url, '">', DynamicForm.options.social.twitter.label, ' <img src="' + DynamicForm.options.URL_PREFIX + '/forms/img/twitter-icon.png"></a></li>', '<li><a href="', DynamicForm.options.social.linkedin.url, '">', DynamicForm.options.social.linkedin.label, ' <img src="' + DynamicForm.options.URL_PREFIX + '/forms/img/linkedin-icon.png"></a></li>', '<li><a href="', DynamicForm.options.social.facebook.url, '">', DynamicForm.options.social.facebook.label, ' <img src="' + DynamicForm.options.URL_PREFIX + '/forms/img/facebook-icon.png"></a></li>', '</ul></div>');
                //check this
            }
            tmpHtml = tmpHtml.concat('</div>');
            DynamicForm.Template.ThankYou.formHtml = tmpHtml;
            return DynamicForm.Template.ThankYou.formHtml;
        },
        html: function(type) {
            var html = '';
            if (typeof DynamicForm.Template.ThankYou.formHtml === 'undefined') {
                html = DynamicForm.Template.ThankYou.render();
            } else {
                html = DynamicForm.Template.ThankYou.formHtml;
            }
            $("#wrapper")
                .css("background", "#eee");
            return html;
        }
    },
    Error: {
        render: function() {
            //reset formHTML, just in case...
            DynamicForm.Template.Error.formHtml = '';
            var tmpHtml = ''.concat('<div id="Error" class="hero-unit error">');
            if (DynamicForm.options.type === DynamicForm.constants.T_FULL) {
                tmpHtml = tmpHtml.concat('<h1>', DynamicForm.views.error.title, '</h1>');
            } else {
                tmpHtml = tmpHtml.concat('<h2>', DynamicForm.views.error.title, '</h2>');
            }
            if (typeof DynamicForm.views.error.text !== 'undefined') {
                tmpHtml = tmpHtml.concat('<p>', DynamicForm.views.error.text, '</p>');
            }
            tmpHtml = tmpHtml.concat('</div>');
            DynamicForm.Template.Error.formHtml = tmpHtml;
            return DynamicForm.Template.Error.formHtml;
        },
        html: function() {
            var html = '';
            if (typeof DynamicForm.Template.Error.formHtml === 'undefined') {
                html = DynamicForm.Template.Error.render();
            } else {
                html = DynamicForm.Template.Error.formHtml;
            }
            $("#wrapper")
                .css("background", "#eee");
            return html;
        }
    }
};

DynamicForm.BuildOption = function(val, label) {
    return $('<option />')
        .attr('value', val)
        .text(label);
};

DynamicForm.Lookup = {
    All: function() {
        var options = DynamicForm.options,
            LookupDef = new $.Deferred();
        //contact dependant on visitor (email)
        var LookupVisitorDef = DynamicForm.Lookup.Visitor();
        var LookupContactDef = new $.Deferred();
        var LookupTacticDef = DynamicForm.Lookup.Tactic();
        var LookupOfferDef = DynamicForm.Lookup.Offer();
        var LookupElqGuidDef = DynamicForm.Lookup.ElqGuid();
        $.when(LookupVisitorDef).then(function() {
            LookupContactDef = DynamicForm.Lookup.Contact();
            $.when(LookupContactDef, LookupTacticDef, LookupOfferDef, LookupElqGuidDef).then(function() {
                LookupDef.resolve();
            });
        });
        return LookupDef;
    },
    ElqGuid: function(callback) {
        var LookupElqGuidDef = new $.Deferred();
        if (typeof DynamicForm.LookupData.elqGUID !== 'undefined') {
            LookupElqGuidDef.resolve();
        } else {
            LookupElqGuidDef = DynamicForm.elqTracker.getGUID();
        }
        $.when(LookupElqGuidDef).then(function() {
            DynamicForm.log("DynamicForm.LookupData.elqGUID: ", DynamicForm.LookupData.elqGUID());
        });
        return LookupElqGuidDef;
    },
    Visitor: function() {
        var VisitorDef = new $.Deferred(),
            LookupDef = new $.Deferred(),
            fields = DynamicForm.options.fields.visitor,
            LookupVisitorDef = DynamicForm.elqTracker.getData({
                lookup: DynamicForm.options.lookup.visitor.key,
                lookupFunc: 'Visitor',
                retry: DynamicForm.options.VisitorLookupRetryCount
            });

        $.when(LookupVisitorDef)
            .then(function() {
                if (typeof DynamicForm.LookupData.Visitor === 'function') {
                    var fieldval = '';

                    var i = 0;
                    for (i = 0; i < fields.length; i++) {
                        if (DynamicForm.LookupData.Visitor(fields[i]) !== '' && DynamicForm.LookupData.Visitor(fields[i]) !== DynamicForm.constants.UNAVAILABLE) {
                            DynamicForm.Prepop.visitor[fields[i]] = DynamicForm.LookupData.Visitor(fields[i]);
                        }
                    }
                }
                VisitorDef.resolve();
            });

        return VisitorDef;
    },
    Contact: function() {
        var ContactDef = new $.Deferred(),
            email = encodeURIComponent(DynamicForm.GetEmailAddress());

        if (DynamicForm.ValueIsEmpty(email) || (typeof DynamicForm.LookupData.Visitor === 'undefined' && typeof DynamicForm.LookupData.Contact === 'function')) {
            ContactDef.resolve();
        } else {
            var ContactLookupParam = ''.concat('<', DynamicForm.options.lookup.contact.query, '>', email, '</', DynamicForm.options.lookup.contact.query, '>'),
                LookupContactDef = DynamicForm.elqTracker.getData({
                    lookup: DynamicForm.options.lookup.contact.key,
                    lookupParam: ContactLookupParam,
                    lookupFunc: 'Contact'
                });

            $.when(LookupContactDef)
                .then(function() {
                    if (typeof DynamicForm.LookupData.Contact === 'function') {
                        var fields = DynamicForm.options.fields.contact;
                        var fieldval = '';

                        var i = 0;
                        for (i = 0; i < fields.length; i++) {
                            DynamicForm.Prepop.contact[fields[i]] = DynamicForm.LookupData.Contact(fields[i]) || DynamicForm.constants.UNAVAILABLE;
                        }
                    }
                    ContactDef.resolve();
                });
        }
        return ContactDef;
    },
    Tactic: function() {
        var TacticDef = $.Deferred(),
            TacticID = DynamicForm.GetTacticID('ext');

        if (DynamicForm.ValueIsEmpty(TacticID) || typeof DynamicForm.LookupData.Tactic === 'function') {
            TacticDef.resolve();
        } else {
            var fields = DynamicForm.options.fields.tactic,
                TacticLookupParam = ''.concat('<', DynamicForm.options.lookup.tactic.query, '>', TacticID, '</', DynamicForm.options.lookup.tactic.query, '>'),
                LookupTacticDef = DynamicForm.elqTracker.getProxyData({
                    lookup: DynamicForm.options.lookup.tactic.key,
                    lookupParam: TacticLookupParam,
                    lookupFunc: 'Tactic'
                });

            $.when(LookupTacticDef).then(function() {
                if (typeof DynamicForm.LookupData.Tactic === 'function') {
                    var fieldval = '';
                    //once the script is loaded, populate the fields accordingly
                    var i = 0;
                    for (i = 0; i < fields.length; i++) {
                        DynamicForm.Prepop.tactic[fields[i]] = DynamicForm.LookupData.Tactic(fields[i]) || DynamicForm.constants.UNAVAILABLE;
                    }
                }
                TacticDef.resolve();
            });
        }
        return TacticDef;
    },
    Offer: function(opts) {
        var OfferDef = new $.Deferred(),
            ms = new Date().getMilliseconds(),
            offer_id = DynamicForm.options.updated_offer_id || DynamicForm.GetOfferID();

        if (DynamicForm.ValueIsEmpty(offer_id) || (typeof DynamicForm.Cache.LookupData.Offer !== 'undefined' && typeof DynamicForm.Cache.LookupData.Offer[offer_id] === 'function')) {
            DynamicForm.LookupData.Offer = DynamicForm.Cache.LookupData.Offer[offer_id];
            OfferDef.resolve();
        } else {
            var fields = DynamicForm.options.fields.offer;
            var OfferLookupParam = ''.concat('<', DynamicForm.options.lookup.offer.query, '>', offer_id, '</', DynamicForm.options.lookup.offer.query, '>');
            var LookupOfferDef = new DynamicForm.elqTracker.getProxyData({
                lookup: DynamicForm.options.lookup.offer.key,
                lookupParam: OfferLookupParam,
                lookupFunc: 'Offer'
            });
            $.when(LookupOfferDef).then(function() {
                if (typeof DynamicForm.Cache.LookupData.Offer === 'undefined') {
                    DynamicForm.Cache.LookupData.Offer = [];
                }

                if (typeof DynamicForm.LookupData.Offer === 'function') {
                    DynamicForm.Cache.LookupData.Offer[offer_id] = DynamicForm.LookupData.Offer;
                    var fieldval = '';
                    //once the script is loaded, populate the fields accordingly
                    var i = 0;
                    for (i = 0; i < fields.length; i++) {
                        DynamicForm.Prepop.offer[fields[i]] = DynamicForm.Cache.LookupData.Offer[offer_id](fields[i]) || DynamicForm.constants.UNAVAILABLE;
                    }
                }
                OfferDef.resolve();
            });
        }

        return OfferDef;
    }
};
DynamicForm.FindElement = function(arr, propName, propValue) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][propName] === propValue) {
            return arr[i];
        }
    }
};
DynamicForm.UpdateFromElqLookup = function(options) {
    var type = options.type;
    var key = options.key;
    var data;
    if (typeof key === 'undefined') {
        data = DynamicForm.LookupData[type];
    } else {
        data = DynamicForm.LookupData[type][key];
    }
    var fields = DynamicForm.options.fields[type];
    var lookupValue = '';
    var field = '';
    if (typeof Data !== 'function') {
        return;
    }
    if (typeof fields === 'undefined') {
        return;
    }
    //once the script is loaded, populate the fields accordingly
    var i = 0;
    var thisFld = '';
    for (i = 0; i < fields.length; i++) {
        try {
            field = DynamicForm.FindElement(DynamicForm.views.form.fieldset, 'id', fields[i]);
            lookupValue = data(fields[i].name);
            if (typeof field === 'undefined') {
                //no field to update
                return;
            } else if ((typeof lookupValue === 'undefined') && (field.type === 'hidden')) {
                //field exists and is hidden, no value in lookup;
                lookupValue = DynamicForm.constants.UNAVAILABLE;
            } else if ((typeof lookupValue === 'undefined') && (field.type !== 'hidden')) {
                //field exists and is not hidden, no value in lookup;
                lookupValue = '';
            }
            //otherwise, update with what we got back :)
            //update existing form
            $('#' + field.id)
                .val(lookupValue);
            //update form definition
            field.value = lookupValue;
        } catch (e) {
            DynamicForm.error('DynamicForm.UpdateFromElqLookup', e);
        }
    }
};
DynamicForm.MultipleOffers = {
    start: function(opts) {
        var options = $.extend({}, opts, DynamicForm.options);
        var MultipleOffersInit = new $.Deferred();
        DynamicForm.options.uxType = 'Multiple Offers';
        var gatedUrlSearch = '/forms/?offer_id=';
        var ct = DynamicForm.GetClientPlatform();
        try {
            $('a[href*="' + gatedUrlSearch + '"]')
                .colorbox({
                    debug: false,
                    //TODO: remove iframe?
                    iframe: true,
                    fastIframe: true,
                    width: '640px',
                    height: '560px',
                    href: function() {
                        var qs = "&v=" + DynamicForm.constants.V_FORM;

                        if (typeof s.prop14 !== 'undefined') {
                            qs += "&prop14=" + s.prop14;
                        }

                        if (typeof s.eVar27 !== 'undefined') {
                            qs += "&eVar27=" + s.eVar27;
                        }

                        if (typeof s.channel !== 'undefined') {
                            qs += "&channel=" + s.channel;
                        }

                        if (typeof document.referrer !== 'undefined' && document.referrer !== '' && document.referrer !== DynamicForm.constants.UNAVAILABLE) {
                            qs += "&ref=" + document.referrer;
                        }
                        qs += "&lpg=" + document.URL;
                        return this.href + qs;
                    },
                    speed: 300,
                    escKey: true,
                    reposition: true,
                    scrolling: false,
                    fixed: false,
                    onOpen: function() {
                        DynamicForm.options.type = DynamicForm.constants.T_FULL;
                        $("#wrapper")
                            .css("background", "transparent")
                            .css("max-width", "100%");
                        if (ct === 'mobile') {
                            window.open($(this)
                                .attr('href'), '_blank');
                            $.colorbox.close();
                        }
                    }
                });
            MultipleOffersInit.resolve();
        } catch (err) {
            MultipleOffersInit.resolve();
        }
        return MultipleOffersInit;
    }
};
DynamicForm.Form = {
    UpdateFromUDF: function(field) {
        var udf_field = $(field),
            updates_offer_id = udf_field.data("updates_offer_id");

        if (updates_offer_id) {
            $("#C_Addition_Information1").val("New Offer Selected: " + udf_field.val());
            DynamicForm.options.updated_offer_id = udf_field.val();
        }
    },
    start: function(opts) {
        DynamicForm.ShowLoadingMsg("Please wait...");

        //choose form or auto submit here
        var options = $.extend({}, opts, DynamicForm.options),
            FormInit = new $.Deferred(),
            PopulateFieldDef = null,
            LookupDef = DynamicForm.Lookup.All(),
            view = DynamicForm.constants.V_FORM;
        DynamicForm.options.form_type = 'form';

        $.when(LookupDef).then(function() {
            var hasSubmittedLongForm = false,
                registrationDate = '',
                email = encodeURIComponent(DynamicForm.GetEmailAddress()),
                channel = $.url(document.URL).param('channel') || 'landing page',
                offer_id = DynamicForm.GetOfferID(),
                offerAccessRule = DynamicForm.LookupData.Offer(DynamicForm.options.lookup.offer.fields.accessrule) === 'Track' ? 'tracked' : 'gated',
                TriggerOmnitureDef = null;

            var parentFirstMinor = '';

            if ($.url(document.URL).param('prop14')) {
                parentFirstMinor = " | " + $.url(document.URL).param('prop14');
            } else if ($.url(document.URL).param('eVar27')) {
                parentFirstMinor = " | " + $.url(document.URL).param('eVar27');
            }

            if (offerAccessRule.toLowerCase() === 'tracked') {
                view = DynamicForm.constants.V_AUTO;
                DynamicForm.options.form_type = 'autosubmit';
            }

            if (typeof DynamicForm.LookupData.Contact === 'function') {
                hasSubmittedLongForm = DynamicForm.LookupData.Contact(DynamicForm.options.lookup.contact.fields.hasRegistered);
                registrationDate = DynamicForm.LookupData.Contact(DynamicForm.options.lookup.contact.fields.registeredDate);
                if ((offerAccessRule.toLowerCase() === 'tracked') || (hasSubmittedLongForm && DynamicForm.isRegistrationCurrent(registrationDate))) {
                    view = DynamicForm.constants.V_AUTO;
                    DynamicForm.options.form_type = 'autosubmit';
                } else {
                    view = DynamicForm.constants.V_FORM;
                    DynamicForm.options.form_type = 'form';
                }
            }

            if (typeof DynamicForm.options.CustomQuestions !== 'undefined') {
                view = DynamicForm.constants.V_FORM;
                DynamicForm.options.form_type = 'form';
            }

            if ((DynamicForm.options.lookup.offer.fields.type.toLowerCase() === 'event') || (DynamicForm.options.lookup.offer.fields.type.toLowerCase() === 'tradeshow')) {
                view = DynamicForm.constants.V_FORM;
                DynamicForm.options.form_type = 'form';
            }

            if (view !== DynamicForm.constants.V_AUTO) {
                FormInit = DynamicForm.Form.long();
            } else {
                FormInit = DynamicForm.Form.auto();
            }
        });

        $.when(FormInit).then(function() {
            if (view === DynamicForm.constants.V_AUTO && DynamicForm.options.form_type === 'autosubmit') {
                var ShowFormInitTriggerOmnitureDef = new DynamicForm.Tracking.Omniture.Trigger();
                $.when(ShowFormInitTriggerOmnitureDef).then(function() {
                    DynamicForm.Form.SubmitDynamicForm();
                });
            }
        });

        return FormInit;
    },
    auto: function(opts) {
        DynamicForm.ShowLoadingMsg("Please wait...");

        //choose form or auto submit here
        var options = $.extend({}, opts, DynamicForm.options),
            AutoFormInit = new $.Deferred(),
            PopulateFieldDef = null,
            view = DynamicForm.constants.V_FORM,
            hasSubmittedLongForm = false,
            registrationDate = '',
            email = encodeURIComponent(DynamicForm.GetEmailAddress()),
            channel = $.url(document.URL).param('channel') || 'landing page',
            offer_id = DynamicForm.GetOfferID(),
            offerAccessRule = DynamicForm.LookupData.Offer(DynamicForm.options.lookup.offer.fields.accessrule) === 'Track' ? 'tracked' : 'gated',
            TriggerOmnitureDef = null;

        DynamicForm.options.form_type = 'autosubmit';

        var parentFirstMinor = '';

        if ($.url(document.URL).param('prop14')) {
            parentFirstMinor = " | " + $.url(document.URL).param('prop14');
        } else if ($.url(document.URL).param('eVar27')) {
            parentFirstMinor = " | " + $.url(document.URL).param('eVar27');
        }

        DynamicForm.Tracking.Omniture.SetOption('pageName', 'rh | ' + channel + parentFirstMinor + ' | ' + DynamicForm.constants.OMNITURE.FIRST_MINOR_SECTION + ' | ' + offer_id + ' | form');
        DynamicForm.Tracking.Omniture.AddEvent(DynamicForm.constants.OMNITURE.EVENT.PAGE_LOAD);
        DynamicForm.Tracking.Omniture.SetOption('evar48', '');
        DynamicForm.Tracking.Omniture.Trigger();

        container = $(DynamicForm.constants.CONTAINER);

        container.html(DynamicForm.Template.html());

        $(".hidden").hide();

        PopulateFieldDef = DynamicForm.Form.PopulateFields();

        $.when(PopulateFieldDef).then(function() {
            DynamicForm.LoadScript(DynamicForm.options.URL_PREFIX + '/forms/scripts/vendor/demandbaseForm.js', function() {
                var thisForm = $('#' + DynamicForm.constants.ELQ_FORM_NAME);
                var offerAccessRule = DynamicForm.LookupData.Offer(DynamicForm.options.lookup.offer.fields.accessrule) === 'Track' ? 'tracked' : 'gated';
                $("#A_UX_Type").val("Autosubmit " + offerAccessRule);

                DemandbaseForm.formConnector.init();

                thisForm.attr('action', DynamicForm.constants.URL.FORM_SUBMIT);
                DynamicForm.Form.SubmitDynamicForm();

                AutoFormInit.resolve();
            });
        });

        return AutoFormInit.promise;
    },
    long: function(opts) {
        DynamicForm.ShowLoadingMsg("Please wait...");
        var options = $.extend({}, opts, DynamicForm.options),
            self = this,
            container = $(DynamicForm.constants.CONTAINER),
            thisForm = $('#' + DynamicForm.constants.ELQ_FORM_NAME);

        DynamicForm.options.uxType = 'Long Form';

        //TODO: load thankyou page if its the right thing to do?
        var BuildFormInit = new $.Deferred(),
            ConfigFormInit = new $.Deferred(),
            ShowFormInit = new $.Deferred();
        var qsParams = '';
        var email = DynamicForm.GetEmailAddress(),
            TacticID = DynamicForm.GetTacticID('ext'),
            offer_id = DynamicForm.GetOfferID();
        var LookupKeys = [{
            name: 'visitor',
            key: ''
        }, {
            name: 'contact',
            key: email
        }, {
            name: 'tactic',
            key: TacticID
        }, {
            name: 'offer',
            key: offer_id
        }],
            LookupKey, LookupFields = DynamicForm.options.fields,
            LookupFromKey;
        for (var i in LookupKeys) {
            if (LookupKeys.hasOwnProperty(i)) {
                LookupKey = LookupKeys[i];
                if (DynamicForm.CheckValue(LookupKey.key) && DynamicForm.CheckValue(DynamicForm.LookupData[LookupKey.name])) {
                    LookupFromKey = DynamicForm.LookupData[LookupKey.name][LookupKey.key];
                } else {
                    LookupFromKey = DynamicForm.LookupData[LookupKey.name];
                }
                if (typeof LookupFromKey !== 'undefined') {
                    DynamicForm.UpdateFromElqLookup({
                        type: LookupKey.name,
                        key: LookupKey.key
                    });
                }
            }
        }
        DynamicForm.VerificationID = DynamicForm.UpdateVerificationID();
        container.html(DynamicForm.Template.html());
        $(".hidden").hide();


        DynamicForm.LoadScript(DynamicForm.options.URL_PREFIX + '/forms/scripts/vendor/widget.js', function() {
            var PopulateFieldDef = DynamicForm.Form.PopulateFields();
            $.when(PopulateFieldDef).then(function() {
                $('#FormSubmitButton')
                    .off('click');
                $('#C_BusPhone')
                    .val(' ')
                    .mask('(?999) 999-9999 x99999');
                $('#FormSubmitButton')
                    .on('click', function(e) {
                        e.preventDefault();
                        $('#FormSubmitButton').attr("disabled", true).text('Submitting...');
                        thisForm.attr('action', DynamicForm.constants.URL.FORM_SUBMIT);
                        DynamicForm.Form.SubmitDynamicForm();
                    });
                BuildFormInit.resolve();
            });

            $.when(BuildFormInit).then(function() {

                var channel = $.url(document.URL).param('channel') || 'landing page';

                var parentFirstMinor = '';

                if ($.url(document.URL).param('prop14')) {
                    parentFirstMinor = " | " + $.url(document.URL).param('prop14');
                } else if ($.url(document.URL).param('eVar27')) {
                    parentFirstMinor = " | " + $.url(document.URL).param('eVar27');
                }

                DynamicForm.Tracking.Omniture.SetOption('pageName', 'rh | ' + channel + parentFirstMinor + ' | ' + DynamicForm.constants.OMNITURE.FIRST_MINOR_SECTION + ' | ' + offer_id + ' | form');
                DynamicForm.Tracking.Omniture.AddEvent(DynamicForm.constants.OMNITURE.EVENT.PAGE_LOAD);

                if (DynamicForm.GetTacticID('int') !== DynamicForm.constants.UNAVAILABLE && (typeof $.url(document.URL).param('intcmp') === 'undefined')) {
                    DynamicForm.Tracking.Omniture.SetOption('eVar1', DynamicForm.options.intcmp);
                    DynamicForm.Tracking.Omniture.AddEvent(DynamicForm.constants.OMNITURE.EVENT.INTCMP);
                } //othersise, let s_code do its thing

                $('select').each(function() {
                    var updates_offer_id = $(this).attr('data-updates_offer_id');

                    if (updates_offer_id) {
                        $(this).on('change', function() {
                            DynamicForm.Form.UpdateFromUDF(this);
                        });
                    }
                });

                $('#FormSubmitButton').off('click');
                thisForm = $('#' + DynamicForm.constants.ELQ_FORM_NAME);
                DynamicForm.LoadScript(DynamicForm.options.URL_PREFIX + '/forms/scripts/vendor/demandbaseForm.js', function() {
                    DemandbaseForm.formConnector.init();
                    if (DynamicForm.options.type !== DynamicForm.constants.T_EMBEDDED) {
                        thisForm.addClass("form-horizontal");
                    } else {
                        thisForm.addClass("scrolly-taller");
                    }
                    DynamicForm.Form.UpdateJobRoleList();
                });
                $.when(DynamicForm.Translate(DynamicForm.GetLanguageCode(), function() {
                    $('#C_Department1').off('change');
                    DynamicForm.Form.UpdateJobRoleList();
                    $('#A_Timestamp').val(DynamicForm.GetTimestamp());
                    $('#A_ReferringPageURL').val(DynamicForm.GetReferringPageURL());
                    $('#C_Department1').on('change', function() {
                        DynamicForm.Form.UpdateJobRoleList();
                    });
                }));
                //TODO: should be required and empty: QA_Ruaspambot
                $.validator.addMethod('phone', function(value, element) {
                    if (self.optional(element)) {
                        return true;
                    }
                    var re = /^([^a-zA-Z]*)$/;
                    return re.test(value);
                }, 'Please enter a valid phone number.');
                $.validator.addMethod('spamalot', function(value, element) {
                    return value === '';
                }, "Are you sure you're human?");
                var msg = 'Please fill out all fields marked in red.';
                thisForm.validate({
                    debug: false,
                    onkeyup: false,
                    onclick: false,
                    onfocusout: false,
                    rules: {
                        'C_FirstName': {
                            required: true
                        },
                        'C_LastName': {
                            required: true
                        },
                        'C_EmailAddress': {
                            required: true,
                            email: true
                        },
                        'C_BusPhone': {
                            required: true,
                            minlength: 14
                            //phoneUS : true
                        },
                        'C_Company': {
                            required: true
                        },
                        'C_Department1': {
                            required: true
                        },
                        'QA_Ruaspambot': {
                            spamalot: true
                        },
                        'C_Job_Role11': {
                            required: true
                        }
                    },
                    groups: {
                        all: ['C_FirstName', 'C_LastName', 'C_Department1', 'C_EmailAddress', 'C_BusPhone', 'C_Company', 'C_Job_Role11', 'UDF_01_Answer', 'UDF_02_Answer', 'UDF_03_Answer'].join(' ')
                    },
                    messages: {
                        'C_FirstName': msg,
                        'C_LastName': msg,
                        'C_EmailAddress': msg,
                        'C_BusPhone': msg,
                        'C_Company': msg,
                        'C_Department1': msg,
                        'C_Job_Role11': msg,
                        'UDF_01_Answer': msg,
                        'UDF_02_Answer': msg,
                        'UDF_03_Answer': msg
                    },
                    errorLabelContainer: '#validationMessages',
                    showErrors: function(errorMap, errorList) {
                        self.validationErrors(this, errorList);
                    },
                    invalidHandler: function(event, validator) {
                        // 'this' refers to the form
                        var errors = validator.numberOfInvalids();
                        var messages = $('#validationMessages');
                        $('#FormSubmitButton')
                            .attr("disabled", false)
                            .text('Continue');
                        $.when(DynamicForm.Translate(DynamicForm.GetLanguageCode(), function() {
                            if (errors) {
                                messages.slideDown();
                            } else {
                                messages.slideUp();
                            }
                        }))
                            .then(function() {
                                DynamicForm.HideLoadingMsg(DynamicForm.constants.ELQ_FORM_NAME);
                            });
                    }
                });

                $.when(DynamicForm.Form.PopulateFields()).then(function() {
                    $('#FormSubmitButton').on("click", function(e) {
                        e.preventDefault();
                        $('#FormSubmitButton').attr("disabled", true).text('Submitting...');
                        thisForm.attr('action', DynamicForm.constants.URL.FORM_SUBMIT);
                        DynamicForm.Form.SubmitDynamicForm();
                    });
                    ConfigFormInit.resolve();
                });

                return ConfigFormInit;
            }).then(function() {
                var offer_id = DynamicForm.GetOfferID();
                var channel = $.url(document.URL).param('channel') || 'landing page';
                DynamicForm.Tracking.Omniture.SetOption('pageName', 'rh | ' + channel + ' | ' + DynamicForm.constants.OMNITURE.FIRST_MINOR_SECTION + ' | ' + offer_id + ' | form');
                DynamicForm.Tracking.Omniture.AddEvent(DynamicForm.constants.OMNITURE.EVENT.PAGE_LOAD);

                if (DynamicForm.GetTacticID('int') !== DynamicForm.constants.UNAVAILABLE && (typeof $.url(document.URL).param('intcmp') === 'undefined')) {
                    DynamicForm.Tracking.Omniture.SetOption('eVar1', DynamicForm.options.intcmp);
                    DynamicForm.Tracking.Omniture.SetOption('evar48', '');
                    DynamicForm.Tracking.Omniture.AddEvent(DynamicForm.constants.OMNITURE.EVENT.INTCMP);
                } //othersise, let s_code do its thing

                var ShowFormInitTriggerOmnitureDef = new DynamicForm.Tracking.Omniture.Trigger();

                $.when(ShowFormInitTriggerOmnitureDef).then(function() {
                    DynamicForm.HideLoadingMsg(DynamicForm.constants.ELQ_FORM_NAME);
                    ShowFormInit.resolve();
                });
            });
        });

        return ShowFormInit;
    },
    _ValidateElqForm: function(elqForm) {
        return $(elqForm)
            .valid();
    },
    S4: function() {
        // http://note19.com/2007/05/27/javascript-guid-generator/
        return (((1 + Math.random()) * 0x10000) | 0)
            .toString(16)
            .substring(1);
    },
    validationErrors: function(validator, errorList) {
        var len = errorList.length;
        var i = 0;
        $('.error')
            .removeClass('error');
        $('.control-group .btn-danger')
            .removeClass('btn-danger');
        if (len > 0) {
            for (i = 0; i < len; i++) {
                var $el = $(errorList[i].element);
                $el.closest('.control-group')
                    .addClass('error');
                $('button[data-id="' + $el.attr('id') + '"]')
                    .addClass('btn-danger');
            }
        }
        if (validator.numberOfInvalids() > 0) {
            $('#validationMessages')
                .slideDown();
            $('label.error')
                .addClass('text-error');
            validator.defaultShowErrors();
        } else {
            $('#validationMessages')
                .slideUp();
        }
    },
    PopulateFields: function() {
        var PopulateFieldsDef = new $.Deferred();
        var email = DynamicForm.GetEmailAddress(),
            TacticID = DynamicForm.GetTacticID('ext'),
            offer_id = DynamicForm.GetOfferID();
        var Lookup;
        var SubLookup;
        var LookupFields = DynamicForm.options.fields;
        var PrepopValue;
        var FormObj = $('#' + DynamicForm.constants.ELQ_FORM_NAME);

        DynamicForm.Prepop.offer.A_PartnerID = DynamicForm.GetPartnerID();
        DynamicForm.Prepop.visitor.A_UX_Language = DynamicForm.GetLanguageCode();

        if (typeof DynamicForm.LookupData.elqGUID === 'function') {
            DynamicForm.Prepop.visitor.A_ElqVisitorGuid = DynamicForm.LookupData.elqGUID();
            DynamicForm.Prepop.visitor.elqCustomerGUID = DynamicForm.LookupData.elqGUID();
        }

        var vID = DynamicForm.GetVerificationID({
            force: true
        });

        DynamicForm.Prepop.visitor.A_UX_Type = DynamicForm.options.uxType;
        DynamicForm.Prepop.visitor.A_ReferringPageURL = DynamicForm.GetReferringPageURL();
        DynamicForm.Prepop.visitor.A_LandingPageURL = document.URL;
        DynamicForm.Prepop.visitor.A_Timestamp = DynamicForm.GetTimestamp();
        DynamicForm.Prepop.contact.A_SubmissionID = DynamicForm.GetSubmissionId();
        DynamicForm.Prepop.contact.A_VerificationID = vID;

        DynamicForm.Prepop.tactic.A_TacticID_Internal = DynamicForm.CheckValue(DynamicForm.GetTacticID('int')) ? DynamicForm.GetTacticID('int') : DynamicForm.GetTacticIDFromCookie('int');
        DynamicForm.Prepop.tactic.A_TacticID_External = DynamicForm.GetTacticID('ext');
        DynamicForm.Prepop.tactic.Apps_Tactics_T_Campaign_ID_181 = DynamicForm.GetTacticID('ext');

        DynamicForm.Prepop.offer.A_RedirectURL = DynamicForm.GetRedirectURL({
            offer_id: DynamicForm.options.updated_offer_id || offer_id,
            pid: DynamicForm.GetPartnerID(),
            sc_cid: DynamicForm.GetTacticID('ext'),
            verificationid: vID
        });
        var $field, Group, Fields, Field, FieldName, FieldValue;
        for (Group in DynamicForm.options.fields) {
            if (DynamicForm.options.fields.hasOwnProperty(Group)) {
                Fields = DynamicForm.options.fields[Group];
                for (var idx in Fields) {
                    if (Fields.hasOwnProperty(idx)) {
                        FieldName = Fields[idx];
                        FieldValue = DynamicForm.Prepop[Group][FieldName];

                        $field = $('#' + FieldName, FormObj);
                        if ($field.filter(':hidden') && FieldValue === '' && FieldName !== 'C_BusPhone') {
                            FieldValue = DynamicForm.constants.UNAVAILABLE;
                        }
                        try {
                            if (DynamicForm.ValueIsEmpty($field.val())) {
                                $field.val(FieldValue);
                            }
                        } catch (e) {
                            DynamicForm.error('DynamicForm.Form.PopulateFields', e);
                        }
                    }
                }
            }
        }

        //$("#C_Job_Role11").val(DynamicForm.Prepop.contact.C_Job_Role11);

        //Non-lookup fields
        $('#elqSiteID')
            .val(DynamicForm.options.elqSiteId);
        $('#A_Timestamp')
            .val(DynamicForm.GetTimestamp());
        $('#A_LandingPageURL')
            .val(document.URL);
        $('#A_PartnerID')
            .val(DynamicForm.GetPartnerID());
        $('#A_UX_Language')
            .val(DynamicForm.GetLanguageCode());
        //$('#A_ElqVisitorGuid').val(DynamicForm.LookupData.elqGUID);
        //$('#elqCustomerGUID').val(DynamicForm.LookupData.elqGUID);
        if (typeof DynamicForm.LookupData.elqGUID === 'function') {
            $('#A_ElqVisitorGuid')
                .val(DynamicForm.LookupData.elqGUID());
            $('#elqCustomerGUID')
                .val(DynamicForm.LookupData.elqGUID());
        }
        $("#C_BusPhone")
            .val("");
        $('#A_UX_Type')
            .val(DynamicForm.options.uxType);
        $('#A_ReferringPageURL')
            .val(DynamicForm.GetReferringPageURL());
        $('#A_LandingPageURL')
            .val(document.URL);
        $('#A_Timestamp')
            .val(DynamicForm.GetTimestamp());
        $('#A_SubmissionID')
            .val(DynamicForm.GetSubmissionId());
        $('#A_VerificationID')
            .val(vID);
        $('#A_TacticID_Internal')
            .val(DynamicForm.CheckValue(DynamicForm.GetTacticID('int')) ? DynamicForm.GetTacticID('int') : DynamicForm.GetTacticIDFromCookie('int'));
        $('#A_TacticID_External')
            .val(DynamicForm.GetTacticID('ext'));
        $('#A_RedirectURL').val(DynamicForm.GetRedirectURL({
            offer_id: DynamicForm.options.updated_offer_id || offer_id,
            pid: DynamicForm.GetPartnerID(),
            sc_cid: DynamicForm.GetTacticID('ext'),
            verificationid: vID
        }));
        $('#QA_Version')
            .val(DynamicForm.options.QA_Version);
        //Update other fields
        PopulateFieldsDef.resolve();
        //});
        return PopulateFieldsDef;
    },
    SubmitDynamicForm: function() {
        DynamicForm.ShowLoadingMsg("Please wait...");

        $('#A_SubmissionID').val(DynamicForm.GetSubmissionId());

        var offer_id = DynamicForm.GetOfferID();
        var vID = DynamicForm.GetVerificationID({
            force: true
        });

        $('#A_RedirectURL').val(DynamicForm.GetRedirectURL({
            offer_id: DynamicForm.options.updated_offer_id || offer_id,
            pid: DynamicForm.GetPartnerID(),
            sc_cid: DynamicForm.GetTacticID('ext'),
            verificationid: vID
        }));

        $('#' + DynamicForm.constants.ELQ_FORM_NAME).submit();

        DynamicForm.log("DynamicForm.options.URL_PREFIX: ", DynamicForm.options.URL_PREFIX);

        $.receiveMessage(function(e) {
            // Get the height from the passed data.';
            DynamicForm.log("[SubmitDynamicForm] query string: ?" + e.data);

            var params = $.url("file.html?" + e.data).param();

            var status = $.url("file.html?" + e.data).param('status');
            DynamicForm.log("[SubmitDynamicForm] status:", status);

            var offer_id = $.url("file.html?" + e.data).param('offer_id');
            DynamicForm.log("[SubmitDynamicForm] offer_id:", offer_id);

            if (status === DynamicForm.constants.STATUS_OK) {
                if (offer_id !== '') {
                    DynamicForm.options.offer_id = offer_id;
                }
                DynamicForm.Tracking.GoogleRemarketing.Trigger();
                DynamicForm.Tracking.GoogleAdWordsConversion.Trigger();
                DynamicForm.Tracking.Omniture.ResetEvents();
                DynamicForm.Thanks.start();
                DynamicForm.log("[SubmitDynamicForm] form submitted and Thanks page started...");
            } else {
                DynamicForm.error('DynamicForm.Form.SubmitDynamicForm receiveMessage', "status = " + status);
                DynamicForm.error('DynamicForm.Form.SubmitDynamicForm receiveMessage', e);
            }
            // An optional origin URL (Ignored where window.postMessage is unsupported).
        }, DynamicForm.options.URL_PREFIX);
    },
    prepareSelectsForEloqua: function(elqForm) {
        var selects = $('select', elqForm);
        for (var i = 0; i < selects.length; i++) {
            if (selects[i].multiple) {
                DynamicForm.Form.CreateEloquaSelectField(elqForm, selects[i]);
            }
        }
        return true;
    },
    CreateEloquaSelectField: function(elqForm, sel) {
        var inputName = sel.name;
        var newInput = document.createElement('INPUT');
        newInput.style.display = 'none';
        newInput.name = inputName;
        newInput.value = '';
        for (var i = 0; i < sel.options.length; i++) {
            if (sel.options[i].selected) {
                newInput.value += sel.options[i].value + '::';
            }
        }
        if (newInput.value.length > 0) {
            newInput.value = newInput.value.substr(0, newInput.value.length - 2);
        }
        sel.disabled = true;
        newInput.id = inputName;
        elqForm.insertBefore(newInput, elqForm.firstChild);
    },
    UpdateJobRoleList: function() {
        $('#C_Department1')
            .off('change');
        var thisForm = $('#' + DynamicForm.constants.ELQ_FORM_NAME),
            departmentField = $('#' + DynamicForm.options.lookup.contact.fields.department),
            jobRoleField = $('#C_Job_Role11'),
            jobRoleLabel = $('label[for=C_Job_Role11]', thisForm),
            SelectedDepartment = $('option:selected', departmentField).val(),
            SelectedJobRole = $('option:selected', jobRoleField).val(),
            origOptions = $('option', jobRoleField);

        origOptions.detach();
        jobRoleLabel.removeClass('disabled');
        jobRoleField.removeClass('disabled')
            .attr('disabled', false);
        var options = [];
        switch (SelectedDepartment) {
            case 'IT - Applications / Development':
                options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security / Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Other", "Programmer / Developer", "Specialist / Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                break;
            case 'IT - Business Intelligence':
                options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security / Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Other", "Programmer / Developer", "Specialist / Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                break;
            case 'IT - Desktop / Help Desk':
                options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security / Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Other", "Programmer / Developer", "Specialist / Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                break;
            case 'IT - Network':
                options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security / Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Other", "Programmer / Developer", "Specialist / Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                break;
            case 'IT - Operations':
                options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security / Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Other", "Programmer / Developer", "Specialist / Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                break;
            case 'IT - Project Management':
                options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security / Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Other", "Programmer / Developer", "Specialist / Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                break;
            case 'IT - Quality / Testing':
                options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security / Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Other", "Programmer / Developer", "Specialist / Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                break;
            case 'IT - Risk / Compliance / Security':
                options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security / Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Other", "Programmer / Developer", "Specialist / Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                break;
            case 'IT - Database':
                options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security / Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Other", "Programmer / Developer", "Specialist / Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                break;
            case 'IT - Server / Storage':
                options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security / Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Other", "Programmer / Developer", "Specialist / Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                break;
            case 'IT - Telecom':
                options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security / Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Other", "Programmer / Developer", "Specialist / Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                break;
            case 'IT - Web':
                options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security / Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Other", "Programmer / Developer", "Specialist / Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                break;
            case 'IT - All':
                options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security / Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Other", "Programmer / Developer", "Specialist / Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                break;
            case 'Customer Service / Call Center':
                options = ["Consultant", "Director", "Manager", "Other", "Representative / Specialist", "Vice President"];
                break;
            case 'Executive Office':
                options = ["Assistant", "CEO", "CFO", "Chairman", "Chief Architect", "Chief Security / Compliance Officer", "CIO", "CMO", "COO", "CTO", "General Counsel", "General Manager", "Other", "Owner", "Partner / Principal", "President"];
                break;
            case 'Finance':
                options = ["CFO", "Consultant", "Finance / Accounting", "Other", "Procurement / Purchasing", "Treasurer / Comptroller", "Vice President"];
                break;
            case 'Human Resources':
                options = ["Consultant", "Director", "Manager", "Other", "Representative / Specialist", "Vice President"];
                break;
            case 'Legal':
                options = ["Consultant", "General Counsel", "Lawyer / Solicitor", "Legal Services / Paralegal", "Other", "Partner / Principal"];
                break;
            case 'Marketing Communications':
                options = ["CMO", "Consultant", "Director", "Industry Analyst", "Manager", "Other", "Press / Media", "Representative / Specialist", "Vice President"];
                break;
            case 'Research & Development':
                options = ["Architect", "Chief Architect / Chief Scientist", "Consultant", "CTO", "Director", "Engineer", "Manager", "Other", "Product Manager", "Programmer / Developer", "Student", "Vice President"];
                break;
            case 'Sales':
                options = ["Account Executive / Manager", "Consultant", "Director", "General Manager", "Manager", "Other", "Vice President"];
                break;
            case 'Technical Support':
                options = ["Consultant", "Director", "Engineer / Specialist", "Manager", "Other", "Vice President"];
                break;
            case 'Other':
                options = ["Consultant", "Director", "Industry Analyst", "Manager", "Other", "Press / Media", "Professor / Instructor", "Staff", "Student", "Vice President"];
                break;
            default:
                jobRoleLabel.addClass('disabled');
                options = [];
                break;
        }
        var i = 0;
        var plsSelect = '<option value="">-- Please Select --</option>';
        jobRoleField.append(plsSelect);
        for (i = 0; i < options.length; i++) {
            jobRoleField.append('<option value="' + options[i] + '">' + options[i] + '</option>');
        }
        $('#C_Department1')
            .on('change', function() {
                DynamicForm.Form.UpdateJobRoleList();
                DynamicForm.Translate(DynamicForm.GetLanguageCode());
            });

        if (SelectedDepartment === '') {
            jobRoleLabel.addClass('disabled');
            jobRoleField.addClass('disabled')
                .attr('disabled', true);
            return;
        }
        DynamicForm.Form.UpdateDisabled($(':input', thisForm));

        if (SelectedJobRole !== '') {
            jobRoleField.val(SelectedJobRole);
        } else if (DynamicForm.Prepop.contact.C_Job_Role11 !== '') {
            jobRoleField.val(DynamicForm.Prepop.contact.C_Job_Role11);
        };

        return this;
    },
    UpdateDisabled: function(formInputs) {
        formInputs.each(function() {
            var id = $(this)
                .attr('id');
            if ($(this)
                .is(':disabled')) {
                $(this)
                    .addClass('disabled');
                $('label[for=" + id + "]')
                    .addClass('disabled');
            } else {
                $(this)
                    .removeClass('disabled');
                $('label[for=" + id + "]')
                    .removeClass('disabled');
            }
        });
        return this;
    }
};
DynamicForm.VerificationId = '';
DynamicForm.UpdateVerificationID = function() {
    return (DynamicForm.Form.S4() + DynamicForm.Form.S4());
};
DynamicForm.GetVerificationID = function(options) {
    var forceUpdate = false;
    if (typeof options !== 'undefined' && typeof options.force !== 'undefined') {
        forceUpdate = options.force || false;
    }
    DynamicForm.VerificationId = DynamicForm.VerificationId || '';
    if (forceUpdate || DynamicForm.VerificationId === '') {
        //contact and qs do not have a verification id, so make a new one...
        DynamicForm.VerificationId = DynamicForm.UpdateVerificationID();
    }
    return DynamicForm.VerificationId;
};

DynamicForm.UpdateOfferID = function(offer_id) {
    if (window.DynamicForm.options.offer_id !== offer_id) {
        window.DynamicForm.options.offer_id = offer_id;
    };

    if (DynamicForm.options.offer_id !== offer_id) {
        DynamicForm.options.offer_id = offer_id;
    };
};

DynamicForm.GetOfferID = function(update) {
    var offer_id = '1',
        //Default
        qsOffer = $.url(document.URL).param('offer_id'),
        initOffer = DynamicForm.options.offer_id,
        updatedOffer = $("#" + update).val();

    // 1. config
    if (initOffer && initOffer !== '') {
        offer_id = initOffer;
    } else {
        if (qsOffer && qsOffer !== '') {
            // 2. query string
            offer_id = qsOffer;
        } else {
            var rh_offer_id = DynamicForm.Cookies.Read('rh_offer_id');
            if (rh_offer_id !== DynamicForm.constants.UNAVAILABLE) {
                // 3. cookie
                offer_id = rh_offer_id;
            }
        }
    }

    if (DynamicForm.CheckValue(updatedOffer) && updatedOffer !== offer_id) {
        offer_id = updatedOffer;
    }

    return offer_id;
};
DynamicForm.GetInterface = function() {
    var offer_type = DynamicForm.LookupData.Offer(DynamicForm.options.lookup.offer.fields.accessrule) === 'Track' ? 'tracked' : 'gated',
        contact_type = (typeof DynamicForm.LookupData.Contact === 'function') ? 'known' : 'unknown',
        form_type = DynamicForm.options.form_type,
        udf_count = ((typeof DynamicForm.options.CustomQuestions !== 'undefined') ? DynamicForm.options.CustomQuestions.length : '0') + ' udf',
        s_interface = ''.concat(contact_type, ' | ', offer_type, ' | ', form_type, ' | ', udf_count);
    return s_interface;
};
DynamicForm.Tracking = {
    DemandBaseRemarketing: {
        Trigger: function() {
            var myKey = "223190404d28f4fcabacfadefef244ea33868fb1";
            $.getJSON("//api.demandbase.com/api/v2/ip.json?key=" + myKey + "&page=" + document.location.href + "&page_title=" + document.title + "&referrer=" + document.referrer);
        }
    },

    GoogleRemarketing: {
        Trigger: function() {
            var googleImg = document.createElement('img');
            googleImg.src = "//googleads.g.doubleclick.net/pagead/viewthroughconversion/990030321/?value=0&label=rxV4CN_35QQQ8dOK2AM&guid=ON&script=0";
            document.getElementsByTagName('head')[0].appendChild(googleImg);

            return;
        }
    },

    GoogleAnalytics: {
        Trigger: function() {
            var UseAnalyticsDef = $.Deferred(),
                _gaq = _gaq || [];

            _gaq.push(['_setAccount', DynamicForm.options.GoogleAnalyticsID]);
            _gaq.push(['_trackPageview']);

            window._gaq = _gaq;

            return $.getScript(('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js');
        }
    },

    GoogleAdWordsConversion: {
        Trigger: function() {
            var o = DynamicForm.options.GoogleAdWordsConversionTracking;

            window.google_conversion_id = o.id;
            window.google_conversion_language = o.language;
            window.google_conversion_format = o.format;
            window.google_conversion_color = o.color;
            window.google_conversion_label = o.label;
            window.google_conversion_value = 0;
            if (o.value) {
                window.google_conversion_value = o.value;
            }

            var oldDocWrite = document.write; // save old doc write

            document.write = function(node) { // change doc write to be friendlier, temporary
                $("body").append(node);
            }

            return $.getScript("//www.googleadservices.com/pagead/conversion.js", function() {
                document.write = oldDocWrite;
            });
        }
    },

    Omniture: {
        SetOptions: function(o) {
            DynamicForm.Tracking.Omniture.options = $.extend(DynamicForm.Tracking.Omniture.options, o);
        },
        SetOption: function(name, value) {
            DynamicForm.Tracking.Omniture.options[name] = value.toLowerCase();
        },
        events: [],
        options: {},
        AddEvent: function(event) {
            DynamicForm.Tracking.Omniture.events.push(event.toLowerCase());
        },
        ResetEvents: function(event) {
            DynamicForm.Tracking.Omniture.events = [];
        },
        Trigger: function() {
            var OmnitureTrackingDef = new $.Deferred();

            try {
                var o = DynamicForm.Tracking.Omniture.options;

                s.pageName = o.pageName.toLowerCase();

                s.channel = $.url(document.URL).param('channel') || 'landing page';

                if (DynamicForm.CheckValue(o.eVar1)) {
                    s.eVar1 = o.eVar1;
                }

                if (DynamicForm.CheckValue(o.eVar48)) {
                    s.eVar48 = o.eVar48;
                }

                s.eVar30 = DynamicForm.GetOfferID();

                s.eVar31 = DynamicForm.GetInterface();
                if ($.distinct(DynamicForm.Tracking.Omniture.events)[0] === DynamicForm.constants.OMNITURE.EVENT.FORM_SUBMIT) {
                    s.eVar31 = '';
                }

                var lc = DynamicForm.GetLanguageCode();
                if (DynamicForm.CheckValue(lc)) {
                    s.prop2 = s.eVar22 = lc.toLowerCase();
                }

                var cc = DynamicForm.GetCountryCode();
                if (DynamicForm.CheckValue(cc)) {
                    s.prop3 = s.eVar19 = cc.toLowerCase();
                }

                s.prop4 = s.eVar23 = encodeURI(document.URL);
                s.prop21 = s.eVar18 = encodeURI(document.location.href.split("?")[0]);
                s.prop14 = s.eVar27 = DynamicForm.constants.OMNITURE.FIRST_MINOR_SECTION;
                s.prop15 = s.eVar28 = DynamicForm.options.type === DynamicForm.constants.T_EMBEDDED ? 'embedded' : 'lightbox';

                s.events = $.distinct(DynamicForm.Tracking.Omniture.events).join(', ');

                OmnitureTrackingDef = $.getScript(DynamicForm.options.URL_PREFIX + '/j/rh_omni_footer.js');
            } catch(e) {
                OmnitureTrackingDef.resolve();
                DynamicForm.error("DynamicForm.Tracking.Omniture.Trigger", e);
            }

            $.when(OmnitureTrackingDef).then(function() {
                DynamicForm.info("DynamicForm.Tracking.Omniture.Trigger complete");
                DynamicForm.Tracking.Omniture.ResetEvents();
            });

            return OmnitureTrackingDef;
        }
    }
};

DynamicForm.GetSubmissionId = function() {
    var subId = ''.concat(encodeURI(DynamicForm.GetEmailAddress()), '_', DynamicForm.GetTimestamp());
    return subId;
};

DynamicForm.GetTacticID = function(type) {
    //TODO: default tactic id?
    var TacticID = DynamicForm.constants.UNAVAILABLE;
    switch (type) {
        case 'int':
            /* falls through */
        case 'internal':
            //intcmp or rh_omni_itc
            if (typeof DynamicForm.options.intcmp !== 'undefined' && DynamicForm.options.intcmp !== DynamicForm.constants.UNAVAILABLE) {
                TacticID = DynamicForm.options.intcmp;
            } else if (typeof DynamicForm.options.rh_omni_itc !== 'undefined' && DynamicForm.options.rh_omni_itc !== DynamicForm.constants.UNAVAILABLE) {
                TacticID = DynamicForm.options.rh_omni_itc;
            } else if (typeof $.url(document.URL)
                .param('intcmp') !== 'undefined' && $.url(document.URL)
                .param('intcmp') !== DynamicForm.constants.UNAVAILABLE) {
                TacticID = $.url(document.URL)
                    .param('intcmp');
            } else if (typeof $.url(document.URL).param('rh_omni_itc') !== 'undefined' && $.url(document.URL)
                .param('rh_omni_itc') !== DynamicForm.constants.UNAVAILABLE) {
                TacticID = $.url(document.URL).param('rh_omni_itc');
            }
            break;
        case 'ext':
            /* falls through */
        case 'external':
            //sc_cid or rh_omni_tc
            if (typeof DynamicForm.options.sc_cid !== 'undefined' && DynamicForm.options.sc_cid !== DynamicForm.constants.UNAVAILABLE) {
                TacticID = DynamicForm.options.sc_cid;
            } else if (typeof DynamicForm.options.rh_omni_tc !== 'undefined' && DynamicForm.options.rh_omni_tc !== DynamicForm.constants.UNAVAILABLE) {
                TacticID = DynamicForm.options.rh_omni_tc;
            } else if (typeof $.url(document.URL)
                .param('sc_cid') !== 'undefined' && $.url(document.URL)
                .param('sc_cid') !== DynamicForm.constants.UNAVAILABLE) {
                TacticID = $.url(document.URL)
                    .param('sc_cid');
            } else if (typeof $.url(document.URL)
                .param('rh_omni_tc') !== 'undefined' && $.url(document.URL)
                .param('rh_omni_tc') !== DynamicForm.constants.UNAVAILABLE) {
                TacticID = $.url(document.URL)
                    .param('rh_omni_tc');
            } else if (typeof DynamicForm.Cookies.Read('sc_cid') !== 'undefined' && DynamicForm.Cookies.Read('sc_cid') !== DynamicForm.constants.UNAVAILABLE) {
                TacticID = DynamicForm.Cookies.Read('sc_cid');
            } else if (typeof DynamicForm.Cookies.Read('rh_omni_tc') !== 'undefined' && DynamicForm.Cookies.Read('rh_omni_tc') !== DynamicForm.constants.UNAVAILABLE) {
                TacticID = DynamicForm.Cookies.Read('rh_omni_tc');
            }
            break;
    }
    return TacticID;
};

DynamicForm.GetTacticIDFromCookie = function(type) {
    //TODO: default tactic id?
    var TacticID = DynamicForm.constants.UNAVAILABLE;
    switch (type) {
        case 'int':
            /* falls through */
        case 'internal':
            //intcmp or rh_omni_itc
            if (typeof DynamicForm.Cookies.Read('intcmp') !== 'undefined' && DynamicForm.Cookies.Read('intcmp') !== DynamicForm.constants.UNAVAILABLE) {
                TacticID = DynamicForm.Cookies.Read('intcmp');
            } else if (typeof DynamicForm.Cookies.Read('rh_omni_itc') !== 'undefined' && DynamicForm.Cookies.Read('rh_omni_itc') !== DynamicForm.constants.UNAVAILABLE) {
                TacticID = DynamicForm.Cookies.Read('rh_omni_itc');
            }
            break;
        case 'ext':
            /* falls through */
        case 'external':
            //sc_cid or rh_omni_tc
            if (typeof DynamicForm.Cookies.Read('sc_cid') !== 'undefined' && DynamicForm.Cookies.Read('sc_cid') !== DynamicForm.constants.UNAVAILABLE) {
                TacticID = DynamicForm.Cookies.Read('sc_cid');
            } else if (typeof DynamicForm.Cookies.Read('rh_omni_tc') !== 'undefined' && DynamicForm.Cookies.Read('rh_omni_tc') !== DynamicForm.constants.UNAVAILABLE) {
                TacticID = DynamicForm.Cookies.Read('rh_omni_tc');
            }
            break;
    }
    return TacticID;
};

DynamicForm.GetRedirectURL = function(options) {
    var url = ''.concat(DynamicForm.options.URL_PREFIX, '/forms/thanks.html?v=', DynamicForm.constants.V_SEND_MSG);
    if (typeof options.offer_id !== "undefined" && options.offer_id !== DynamicForm.constants.UNAVAILABLE) {
        url = url.concat('&offer_id=', options.offer_id);
    }
    if (typeof options.sc_cid !== "undefined" && options.sc_cid !== DynamicForm.constants.UNAVAILABLE) {
        url = url.concat('&sc_cid=', options.sc_cid);
    }
    if (typeof options.language !== "undefined" && options.language !== DynamicForm.constants.UNAVAILABLE) {
        url = url.concat('&language=', options.language);
    }
    if (typeof options.country !== "undefined" && options.country !== DynamicForm.constants.UNAVAILABLE) {
        url = url.concat('&country=', options.country);
    }
    if (typeof options.pid !== "undefined" && options.pid !== DynamicForm.constants.UNAVAILABLE) {
        url = url.concat('&pid=', options.pid);
    }
    if (typeof options.verificationid !== "undefined" && options.verificationid !== DynamicForm.constants.UNAVAILABLE) {
        url = url.concat('&verificationid=', options.verificationid);
    }
    url = url.concat('&p=', encodeURIComponent(document.location.href.split("?")[0]));
    url = url.concat('&ver=', encodeURIComponent(DynamicForm.options.QA_Version));
    return url;
};
DynamicForm.GetReferringPageURL = function() {
    var ReferringPageURL = $.url(document.URL)
        .param('ref');
    var url;
    if (typeof ReferringPageURL !== 'undefined' && ReferringPageURL !== '' && ReferringPageURL !== DynamicForm.constants.UNAVAILABLE) {
        url = ReferringPageURL;
    } else if (typeof DynamicForm.LookupData.Visitor !== 'undefined') {
        url = DynamicForm.LookupData.Visitor('V_MostRecentReferrer');
    } else {
        url = document.referrer ? document.referrer : DynamicForm.constants.UNAVAILABLE;
    }
    return url;
};
DynamicForm.GetLandingPageURL = function() {
    var LandingPageURL = $.url(document.URL)
        .param('lpg');
    var url;
    if (typeof LandingPageURL !== 'undefined' && LandingPageURL !== '' && LandingPageURL !== DynamicForm.constants.UNAVAILABLE) {
        url = LandingPageURL;
    } else {
        url = document.URL ? document.URL : DynamicForm.constants.UNAVAILABLE;
    }
    return url;
};
DynamicForm.ParseEloquaLookupDate = function(input) {
    var date = '';
    if (input) {
        var parts = input.match(/(\d+)/g);
        // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
        // there seem to be two styles that get returned from eloqua. one starts with the year, and one starts with the month. detect.
        if (parts[0] > 1000) {
            // 2012-11-02 12:00:00
            date = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
            // months are 0-based
        } else {
            // 12-30-2012
            date = new Date(parts[2], parts[0] - 1, parts[1]);
            // months are 0-based
        }
    }
    return date;
};
DynamicForm.isRegistrationCurrent = function(regDateStr) {
    // return false; // use this to force the welcome-back view when testing
    var isCurrent = false;
    if (regDateStr.length > 0) {
        var regDate = DynamicForm.ParseEloquaLookupDate(regDateStr);
        var oneDay = 1000 * 60 * 60 * 24;
        var daysSinceReg = Math.round((new Date()
            .getTime() - regDate) / oneDay);
        if (daysSinceReg <= 180) {
            isCurrent = true;
        }
    }
    return isCurrent;
};
DynamicForm.GetClientPlatform = function() {
    var ua = (navigator.userAgent || navigator.vendor || window.opera);
    if (typeof DynamicForm.options.ClientPlatform === 'undefined') {
        // Mobile/Tablet Logic
        if ((/iPhone|iPod|Android|BlackBerry|Opera Mini|IEMobile/)
            .test(ua)) {
            DynamicForm.options.ClientPlatform = 'mobile';
        } else if ((/iPad|IEMobile/)
            .test(ua)) {
            DynamicForm.options.ClientPlatform = 'tablet';
        } else if ( !! ((/(iPad|SCH-I800|xoom|NOOK|silk|kindle|GT-P7510)/i)
            .test(ua))) {
            DynamicForm.options.ClientPlatform = 'tablet';
        } else {
            DynamicForm.options.ClientPlatform = 'desktop';
        }
    }
    return DynamicForm.options.ClientPlatform;
};
DynamicForm.GetTimestamp = function() {
    var date = new Date();
    return ''.concat(date.getFullYear(), '-', ((date.getMonth() + 1) < 10) ? '0' + ((date.getMonth() + 1)) : (date.getMonth() + 1), '-', (date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate(), ' ', (date.getHours() < 10) ? ('0' + date.getHours()) : date.getHours(), ':', (date.getMinutes() < 10) ? ('0' + date.getMinutes()) : date.getMinutes(), ':', (date.getSeconds() < 10) ? ('0' + date.getSeconds()) : date.getSeconds());
};
DynamicForm.GetEmailAddress = function() {
    var email = '';
    if (typeof DynamicForm.LookupData.Visitor === 'function') {
        email = DynamicForm.LookupData.Visitor(DynamicForm.options.lookup.visitor.fields.email);
        if (email === '') {
            email = DynamicForm.LookupData.Visitor(DynamicForm.options.lookup.visitor.fields.elqEmail);
        }
    }
    var emailQs = $.url(document.URL)
        .param('email');
    if (typeof emailQs !== 'undefined' && emailQs !== '' && emailQs !== 'undefined') {
        email = emailQs;
    }
    var emailVal = $('#' + DynamicForm.options.lookup.contact.fields.email)
        .val();
    if (typeof emailVal !== 'undefined' && emailVal !== '' && emailVal !== 'undefined') {
        email = emailVal;
    }
    return email;
};

DynamicForm.Translate = function(language, callback) {
    //Provides the js18n translation for the Job Roles choices that are created dynamically from this field.
    var langSrc = 'en';
    var langDest = DynamicForm.GetLanguageCode();
    window.js18nConfig = {
        bundlePath: DynamicForm.options.URL_PREFIX + '/j/js18n-bundles'
    };
    return DynamicForm.LoadScript(DynamicForm.options.URL_PREFIX + '/j/js18n.js', function() {
        //TODO: Need to define a DynamicForm-centric message bundle, so we don't clobber stuff from the rest of the site
        js18n.convert(document.body, ['messages'], langSrc, langDest, null);
    });
};
DynamicForm.Thanks = {
    message: function() {
        DynamicForm.Tracking.GoogleRemarketing.Trigger();
        // Append the Iframe into the DOM.
        var url = '',
            src = '',
            openInNewWindow = false;

        if (typeof url === 'undefined' || url === 'undefined') {
            DynamicForm.error("DynamicForm.Thanks.message", {
                url : document.URL,
                params: $.url(document.URL).param()
            });

            openInNewWindow = true;

            url = DynamicForm.options.URL_PREFIX + "/forms/thanks.html";
            src = src.concat(url, divider, "v=", DynamicForm.constants.V_THANKS);
        } else {
            url = decodeURIComponent($.url(document.URL).param('p'));
            src = src.concat(url, divider, "v=", DynamicForm.constants.V_SEND_MSG);
        }

        var divider = "?";
        if (url.indexOf('?') >= 0) {
            divider = "&";
        }

        if (typeof DynamicForm.options.offer_id !== "undefined" && DynamicForm.options.offer_id !== DynamicForm.constants.UNAVAILABLE) {
            src = src.concat('&offer_id=', DynamicForm.options.offer_id);
        }
        if (typeof DynamicForm.options.sc_cid !== "undefined" && DynamicForm.options.sc_cid !== DynamicForm.constants.UNAVAILABLE) {
            src = src.concat('&sc_cid=', DynamicForm.options.sc_cid);
        }
        if (typeof DynamicForm.options.language !== "undefined" && DynamicForm.options.language !== DynamicForm.constants.UNAVAILABLE) {
            src = src.concat('&language=', DynamicForm.options.language);
        }
        if (typeof DynamicForm.options.country !== "undefined" && DynamicForm.options.country !== DynamicForm.constants.UNAVAILABLE) {
            src = src.concat('&country=', DynamicForm.options.country);
        }
        if (typeof DynamicForm.options.pid !== "undefined" && DynamicForm.options.pid !== DynamicForm.constants.UNAVAILABLE) {
            src = src.concat('&pid=', DynamicForm.options.pid);
        }
        if (typeof DynamicForm.options.verificationid !== "undefined" && DynamicForm.options.verificationid !== DynamicForm.constants.UNAVAILABLE) {
            src = src.concat('&verificationid=', DynamicForm.options.verificationid);
        }

        if (openInNewWindow) {
            var newUrl = DynamicForm.GetRedirectURL({
                offer_id: DynamicForm.options.offer_id,
                pid: DynamicForm.GetPartnerID(),
                sc_cid: DynamicForm.GetTacticID('ext'),
                verificationid: DynamicForm.options.verificationid
            });

            window.open(newUrl, "_blank");
        } else {
            var iframe = $('<iframe src="' + src + '" width="0" height="0" scrolling="no" frameborder="0"><\/iframe>').appendTo('body');

            $.postMessage({
                status: DynamicForm.constants.STATUS_OK,
                offer_id: DynamicForm.options.offer_id
            }, src, parent);
        }
    },
    display: function() {
        return DynamicForm.Template.ThankYou.html(DynamicForm.options.view);
    },
    start: function() {
        DynamicForm.ShowLoadingMsg("Please wait...");

        DynamicForm.Cookies.Process();

        DynamicForm.Tracking.GoogleRemarketing.Trigger();
        var content = DynamicForm.Template.ThankYou.html(DynamicForm.options.view),
            //win = window.open('about:blank', null, "height=10,width=10,status=yes,toolbar=no,scrollbars=yes,menubar=no,location=no,alwaysLowered=yes"),
            InitDef = new $.Deferred(),
            LookupDef = DynamicForm.Lookup.All(),
            url = '#';
        DynamicForm.options.uxType = 'Download';

        $.when(LookupDef).then(function() {
            var email = DynamicForm.GetEmailAddress(),
                TacticID = DynamicForm.GetTacticID('ext'),
                offer_id = DynamicForm.options.updated_offer_id || DynamicForm.GetOfferID(),
                url = DynamicForm.LookupData.Offer(DynamicForm.options.lookup.offer.fields.assetUrl),
                container = $(DynamicForm.constants.CONTAINER),
                channel = $.url(document.URL).param('channel') || 'landing page';

            container.append(content);

            $("#" + DynamicForm.constants.ELQ_FORM_NAME).hide();

            DynamicForm.Tracking.Omniture.SetOption('pageName', 'rh | ' + channel + ' | ' + DynamicForm.constants.OMNITURE.FIRST_MINOR_SECTION + ' | ' + DynamicForm.GetOfferID() + ' | thank you');
            DynamicForm.Tracking.Omniture.SetOption('interface', '');
            DynamicForm.Tracking.Omniture.SetOption('evar48', url);

            DynamicForm.Tracking.Omniture.AddEvent(DynamicForm.constants.OMNITURE.EVENT.FORM_SUBMIT);

            $('#FormSubmitBtn').off('click');

            if (DynamicForm.options.view !== DynamicForm.constants.V_MULTIPLE) {
                if (typeof url === 'undefined' || url === '') {
                    DynamicForm.BadOffer.start();
                } else {
                    $('#FormSubmitBtn').attr('href', url).removeClass("disabled");
                }
            } else {
                setTimeout(function() {
                    if (typeof parent.$.colorbox !== 'undefined') {
                        parent.$.colorbox.close();
                    }
                }, 2500);
                $('#FormSubmitBtn').text('Close').show().on('click', function() {
                    if (typeof parent.$.colorbox !== 'undefined') {
                        parent.$.colorbox.close();
                    }
                });
            }

            InitDef.resolve();
        });

        $.when(InitDef).then(function() {
            var container = $(DynamicForm.constants.CONTAINER);
            DynamicForm.HideLoadingMsg();

            $('html, body').stop().animate({
                scrollTop: container.offset().top - 40
            }, 'slow');

            DynamicForm.Tracking.Omniture.Trigger();
        });

        return InitDef;
    }
};
DynamicForm.BadOffer = {
    start: function(opts) {
        DynamicForm.ShowLoadingMsg("Please wait...");

        var options = $.extend({}, opts, DynamicForm.options);

        DynamicForm.options.uxType = 'Bad Offer: ' + DynamicForm.GetOfferID();

        var container = $(DynamicForm.constants.CONTAINER),
            ErrorHTML = DynamicForm.Template.Error.html();

        container.html(ErrorHTML);

        DynamicForm.HideLoadingMsg();

        $('html, body').stop().animate({
            scrollTop: container.offset().top - 40
        }, 'slow');
    }
};
DynamicForm.Event = {
    getICalDateTimeString: function(dt) {
        var dtObj;
        if (typeof dt === 'string') {
            dtObj = new Date(dt);
        }

        // padding function

        function s(a, b) {
            return (1e15 + a + "").slice(-b);
        }

        // default date parameter
        if (typeof dtObj === 'undefined') {
            dtObj = new Date();
        }

        // return ISO datetime
        return dtObj.getUTCFullYear() +
            s(dtObj.getUTCMonth() + 1, 2) +
            s(dtObj.getUTCDate(), 2) + 'T' +
            s(dtObj.getUTCHours(), 2) +
            s(dtObj.getUTCMinutes(), 2) +
            s(dtObj.getUTCSeconds(), 2) + 'Z';
    },
    Tool: function(opts) {
        DynamicForm.InitOptions(opts);

        $("#eventUrl").hide();

        var startDatePicker = $('#startDate').datetimepicker({
            pickSeconds: false,
            startDate: new Date(),
            pick12HourFormat: true,
            language: 'en'
        }),
            endDatePicker = $('#endDate').datetimepicker({
                pickSeconds: false,
                startDate: new Date(),
                pick12HourFormat: true,
                language: 'en'
            });

        var tpl = new t($('#url').html()),
            form = $("#icsBuilder");

        $("#icsBuilder :input:visible").on('change', function(e) {
            e.preventDefault();

            var formObj = $("#icsBuilder").serializeObject(),
                startDatePicker = $('#startDate').data('datetimepicker'),
                endDatePicker = $('#endDate').data('datetimepicker'),
                dtstart = startDatePicker.getDate(),
                dtend = endDatePicker.getDate();

            formObj['startDate'] = encodeURIComponent(dtstart.toDateString());
            formObj['startTime'] = encodeURIComponent(dtstart.toTimeString());
            formObj['endDate'] = encodeURIComponent(dtend.toDateString());
            formObj['endTime'] = encodeURIComponent(dtend.toTimeString());
            formObj['dtstart'] = DynamicForm.Event.getICalDateTimeString(dtstart);
            formObj['dtend'] = DynamicForm.Event.getICalDateTimeString(dtend);
            formObj['url_prefix'] = DynamicForm.options.URL_PREFIX; //url prefix

            var eventUrl = tpl.render(formObj);

            $("#eventUrl").html('\<a href="' + eventUrl + '" target="_blank">' + eventUrl + '\</a>').show();
        });
    },
    GenerateICS: function(opts) {
        DynamicForm.InitOptions(opts);

        var tmplHtml = $('#DynamicEventTemplate').html(),
            tpl = new t(tmplHtml),
            data = $.url(document.URL).param(),
            timestamp = new Date(),
            ICS = tpl.render(data);

        window.location = "data:text/calendar;charset=utf8," + escape(ICS);

        return true;
    }
};
$.fn.elqTrack = function(siteid, elqid) {
    if (typeof elqid === 'undefined') {
        elqid = '';
    }
    if (typeof siteid === 'undefined') {
        return false;
    }
    var src = 'elqTrack';
    var elqVer = 'v200';
    var url = DynamicForm.constants.URL.ELQ_LOOKUP;
    var ref2 = document.referrer !== '' ? document.referrer : 'elqNone';
    this.each(function() {
        var ref = this.href;
        if (ref === '') {
            return false;
        }
        $(this)
            .click(function() {
                var ms = new Date()
                    .getMilliseconds();
                var track = ''.concat(url, '?pps=10&siteid=', siteid, '&elq=', elqid, '&ref=', ref, '&ref2=', ref2, '&ms=', ms);
                $.ajax({
                    url: track,
                    async: false,
                    dataType: 'script'
                });
                return false;
            });
    });
};
var importScript = (function(oHead) {
    function loadError(oError) {
        throw new URIError("The script " + oError.target.src + " is not accessible.");
    }
    return function(sSrc, sId, fOnload) {
        var oScript = document.createElement("script");
        oScript.type = "text\/javascript";
        oScript.src = sSrc;
        oScript.id = sId;
        oScript.async = false;
        oScript.onerror = loadError;
        if (fOnload) {
            oScript.onload = fOnload;
        }
        oHead.appendChild(oScript);
    };
})(document.getElementsByTagName("head")[0]);
//jQuery function
//
//usage:
//var elqTracker = new jQuery.elq(xxx);
//elqTracker.(pageTrack);
$.elq = function(id) {
    var settings;
    var elqVer = 'v200';
    var url = DynamicForm.constants.URL.ELQ_LOOKUP;
    var proxy = DynamicForm.constants.URL.ELQ_LOOKUP_PROXY;
    var siteid = id;
    var elqGUID;
    return {
        pageTrack: function(options) {
            settings = $.extend({
                url: '',
                success: ''
            }, options);
            var src = 'pageTrack',
                ref2 = document.referrer !== '' ? document.referrer : 'elqNone',
                tzo = new Date(20020101)
                    .getTimezoneOffset(),
                ms = new Date()
                    .getMilliseconds(),
                elqSrc;
            if (settings.url !== '') {
                //track the url specified
                elqSrc = url + '?pps=31&siteid=' + siteid + '&ref=' + url + '&ref2=' + ref2 + '&tzo=' + tzo + '&ms=' + ms;
                if ($('#elqFrame')
                    .length > 0) {
                    $(elqFrame)
                        .load(function() {
                            if (typeof settings.success === 'function') {
                                settings.success();
                            }
                        });
                    $('#elqFrame')
                        .attr('src', elqSrc);
                } else {
                    var elqFrame = document.createElement('iframe');
                    elqFrame.style.display = 'none';
                    elqFrame.id = 'elqFrame';
                    $(elqFrame)
                        .load(function() {
                            if (typeof settings.success === 'function') {
                                settings.success();
                            }
                        });
                    elqFrame.src = elqSrc;
                    document.body.appendChild(elqFrame);
                }
            } else {
                //track this page
                elqSrc = url + '?pps=3&siteid=' + siteid + '&ref2=' + ref2 + '&tzo=' + tzo + '&ms=' + ms;
                var elqImg = new Image(1, 1);
                $(elqImg)
                    .load(function() {
                        if (typeof settings.success === 'function') {
                            settings.success();
                        }
                    });
                elqImg.src = elqSrc;
            }
        },
        getGUID: function(callback) {
            var ref = location.href;
            var ms = new Date()
                .getMilliseconds();
            var dlookup = url + '?pps=70&siteid=' + siteid + '&ref=' + ref + '&ms=' + ms;
            return $.getScript(dlookup, function() {
                if (typeof GetElqCustomerGUID !== 'undefined') {
                    if (typeof GetElqCustomerGUID === 'function') {
                        DynamicForm.LookupData.elqGUID = (function() {
                            return GetElqCustomerGUID;
                        })();
                    }
                }
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        processData: function(settings, GetElqContentPersonalizationValue) {
            if (typeof GetElqContentPersonalizationValue !== 'undefined') {
                if (typeof GetElqContentPersonalizationValue === 'function') {
                    if (settings.lookupObj && settings.lookupFunc) {
                        settings.lookupObj[settings.lookupFunc] = (function() {
                            return GetElqContentPersonalizationValue;
                        })();
                        settings.LookupDef.resolve();
                    } else {
                        settings.LookupDef.resolveWith("GetElqContentPersonalizationValue not a function");
                    }
                }
                if (typeof settings.success === 'function') {
                    settings.success();
                }
            }
            settings.lookupObj[settings.lookupFunc];
        },
        getData: function(options) {
            var self = this,
                settings = $.extend({
                    objType: '',
                    lookupObj: DynamicForm.LookupData,
                    src: '',
                    lookupParam: '',
                    lookup: '',
                    success: '',
                    retry: 0,
                    LookupDef: new $.Deferred()
                }, options),
                ms = new Date()
                    .getMilliseconds(),
                jsonpCallback = settings.lookupFunc,
                dlookup = url + '?pps=50&siteid=' + siteid + '&DLKey=' + settings.lookup + '&DLLookup=' + decodeURI(settings.lookupParam) + '&ms=' + ms;

            return $.getScript(dlookup, function() {
                var elqTracker = $.elq(DynamicForm.options.elqSiteId);
                if (typeof GetElqContentPersonalizationValue !== 'undefined') {
                    elqTracker.processData(settings, GetElqContentPersonalizationValue);
                } else {
                    if (options.retry < DynamicForm.constants.MAX_RETRIES) {
                        DynamicForm.log("$.elq.getData " + options.retry);
                        setTimeout(function() {
                            var elqTracker = $.elq(DynamicForm.options.elqSiteId);
                            options.retry++;
                            elqTracker.getData(options);
                        }, 500 * (options.retry));
                    } else {
                        DynamicForm.log("$.elq.getData " + settings.lookupFunc + " gave up...");
                    }
                }
            }).fail(function(xhr, error) {
                DynamicForm.error("$.elq.getData", error);
            });
        },
        getProxyData: function(options) {
            var self = this,
                settings = $.extend({
                    objType: '',
                    lookupObj: DynamicForm.LookupData,
                    src: '',
                    lookupParam: '',
                    lookup: '',
                    success: '',
                    retry: 0,
                    LookupDef: new $.Deferred()
                }, options),
                ms = new Date()
                    .getMilliseconds(),
                jsonpCallback = settings.lookupFunc,
                dlookup = proxy + '?pps=50&siteid=' + siteid + '&DLKey=' + settings.lookup + '&DLLookup=' + decodeURI(settings.lookupParam) + '&ms=' + ms;
            return $.getScript(dlookup, function() {
                var elqTracker = $.elq(DynamicForm.options.elqSiteId);
                if (typeof GetElqContentPersonalizationValue !== 'undefined') {
                    return elqTracker.processData(settings, GetElqContentPersonalizationValue);
                } else {
                    if (options.retry < DynamicForm.constants.MAX_RETRIES) {
                        DynamicForm.log("$.elq.getProxyData retry " + options.retry);
                        setTimeout(function() {
                            var elqTracker = $.elq(DynamicForm.options.elqSiteId);
                            options.retry++;
                            elqTracker.getProxyData(options);
                        }, 500 * (options.retry));
                    } else {
                        DynamicForm.log("$.elq.getProxyData " + settings.lookupFunc + " gave up...");
                    }
                }
            }).fail(function(xhr, error) {
                DynamicForm.error("$.elq.getProxyData", error);
            });
        },
        redirect: function(options) {
            settings = $.extend({
                url: '',
                elq: ''
            }, options);
            if (settings.url === '') {
                return false;
            }
            var src = 'redirect';
            var ms = new Date()
                .getMilliseconds();
            var ref2 = document.referrer !== '' ? document.referrer : 'elqNone';
            var redir = url + '?pps=10&siteid=' + siteid + '&elq=' + settings.elq + '&ref=' + settings.url + '&ref2=' + ref2 + '&ms=' + ms;
            $.ajax({
                url: redir,
                async: false,
                dataType: 'script',
                success: function() {
                    DynamicForm.log("redirect works");
                }
            });
        }
    };
};

$(document).ready(function() {
    var config = {};

    if (typeof GatedFormConfig !== 'undefined') {
        DynamicFormConfig = GatedFormConfig;
    }

    if (typeof DynamicFormConfig !== 'undefined') {
        config = DynamicFormConfig;
    }

    var url = document.URL;
    if (url.indexOf('forms/eventTool.html') > -1) {
        DynamicForm.info("$(document).ready",{msg:"starting DynamicForm.Event.Tool"});
        DynamicForm.Event.Tool(config);
    } else if (url.indexOf('forms/event.html') > -1) {
        DynamicForm.info("$(document).ready",{msg:"starting DynamicForm.Event.GenerateICS"});
        DynamicForm.Event.GenerateICS(config);
    } else {
        DynamicForm.info("$(document).ready",{msg:"starting DynamicForm"});
        DynamicForm.start(config);
    }
});
