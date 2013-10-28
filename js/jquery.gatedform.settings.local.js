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
DynamicForm.ExtSettings = {
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
