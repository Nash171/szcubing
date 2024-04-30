import ballerina/http;
import ballerina/log;

import wso2/choreo.sendemail as ChoreoEmail;

configurable string apiUrl = ?;

type Contest record {
    int id;
    string name;
    string type;
};

public function main() returns error? {
    io:println("API URL: " + apiUrl);
    http:Client apiEndpoint = check new (apiUrl);

    Contest[] contests = check apiEndpoint->/contests();

    foreach Contest contest in contests {
        log:printInfo("Contest: " + contest.id);
    }
}