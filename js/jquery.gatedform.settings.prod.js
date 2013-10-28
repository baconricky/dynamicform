var DynamicForm = window.DynamicForm = window.DynamicForm || {};

DynamicForm.ExtSettings = {
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
