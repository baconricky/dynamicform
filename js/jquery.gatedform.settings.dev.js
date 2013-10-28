var DynamicForm = window.DynamicForm = window.DynamicForm || {};

DynamicForm.ExtSettings = {
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
