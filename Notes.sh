 we should be having a testing environment (python) this will run some test cases which are some kind of objects


from this testing environment it should be reporting and collect into a database 

so in testing env  for (test cases) which has id1,id2....idn should be able to go over DB of ID1 

for testing environment i want to simulate like making 3 dummy test suites , each of them having 3 different tests  , where every test suite after you run that python file it makes an API req with testsuite ID and
the number of pass and fail 
ex random number generator for how many pass or fail 
Dont do like over all thing , suppose there are 10 test cases , our objective it should be like it should be giving percentage pass, percentage fail , These must be done in the data base 
so you just raw the id of the test and then test case 1 and its result and test case 2 and its result for example.
for every test cases also we need unique identifier within the test suite 




 say for example we are doing some testing of an object in testing env (python)  , can be from 1 file 
so essentially once test execution is done that should have like some test suite ID , once its done
with test id and results for each test and what happen , we need to go and put into the database, it makes the request to db to store 


 in DB we will be having multiple test suites ex: id1, id2....idn 
and if already the results are present here in db of any idn , it needs to over ride the results coming from (test status of testing env) in the db 

because if we do 100 runs we dont need to store all 100 runs right 


so from testing env if we do teststatus id3 for example it should go to id3 of db 

test suites can have any number of test cases like 10 test cases for id1 and id2 can have like 35 it can be any n number of test cases per test suite



in the Database , it should have test suite and every test cases that are in that test suite 

say for example , say we want to now report the test id 4, which is already not present in the database , now you make a request to the db , so can you handle the request where if the id doesnt exist , can we make it 
in such way that if it doesnt exist it should be able to create the new id 4 and then take that object from the testing environment and create a new table for that kind of things , if ID exists just populate the
existing table , but if not existing then create the new id table 


so we can make it easier by making one api request which gives all data such as high level things and their statuses and their test cases within them which can be loaded to ui for data massaging 




should make api request from testing environment to your live db and webpage should also make 

example : take one python file and just do dummy generation of some object like create ten test cases and make an API request to the db with testid , testcase names, create some dummy names up to you 
may be 1st one is receipt validation and you are validating like 10 receipts so your id can be some number or what ever you want 
every test case should like receipt 1 , receipt 2 

using random np generator for like those an array of ten receipts like 0 and 1 like 0 as pass and 1 as fail 

so basically sending dummy objects from testing environment , this is to make sure that make it generalized so that if we have an actual testing env itll just automatically sync with db by us posting it in right object



There should be a web page and this should be like all the things from the DB should be put into this webpage (reactjs)   
so on web page we should be able to use some good metrics collection like for testsuite id1 how many pass/fail . 
should use some good widgets to show the status 

so lets say you have initial status screen which shows all testsuites and latest runs , that means as this page is opened , need to make request to db and get all testsuites and get percentage widgets like 
with colour like kinda fail and pass with different circle widgets like when you hover over tool table should show what its like passed or fail like 70% pass or 23% fail like just for example 

structuring out now :
in python how you are planning on sending out object and then move to db and then create that db 
















TASKS i want right now :

construct some object in python file with testid, testname, testcas2e1, result and send them to db and then you can visualize on that object and then work on database 
post testing object from python (post request to populate database)
database should collect test results and their unique storage based on ID
databse should make calculations for tests passed % (this will be used by the UI)
database should also store all the testcases for each testsuite (by testID) for the UI to use
UI Should be a tabbed menu 
initial tab should be high level status of every test suite (% passed)
if user clicks on a test suite it should show a full table of testcases ran and their results 