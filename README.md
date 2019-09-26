# JavaScript JSON parsing comparison: Objects vs Arrays

### Objective
1. Measure and compare the performance and memory impacts of parsing a JavaScript data set
2. Determine which parsing strategy is faster: parsing a list of objects,
OR parsing the same list where each "object" is represented as a list of values.
3. Determine which parsing strategy carries a higher memory impact.

### Exercise

1. Define a simple JavaScript object with 10 properties, each being a random 20 character string.
2. Create an array of 500,000 instances of this object.
3. Create an array of 500,000 _arrays_, where each array is representative of the data encapsulated by the object in step 1.
4. Convert both of these arrays to strings.
5. Using `JSON.parse`, parse each string into an object, while profiling:
    * Parsing duration
    * Memory allocation
    * Memory used
6. Run garbage collection after each test so that it does not affect any future tests.

### Outcome
The following table is output from running `index.js`: 
```
Parse Objects first, then Arrays
------------------------------------------------------
name           executionDuration  heapTotal  heapUsed 
-------------  -----------------  ---------  ---------
Parse Objects  142.42ms           623.21 MB  594.03 MB
Parse Arrays   732.95ms           585.84 MB  547.4 MB 


Parse Arrays first, then Objects
------------------------------------------------------
name           executionDuration  heapTotal  heapUsed 
-------------  -----------------  ---------  ---------
Parse Arrays   839.41ms           585.84 MB  547.46 MB
Parse Objects  181.64ms           621.34 MB  593.76 MB

```

As we can see, parsing a list of objects seems to be the clear winner. The duration of parsing was
__much__ faster for the array of objects than it was for the array of arrays (about 5x faster in fact!).

Though the object parsing _did_ allocate more memory than the array parsing did (~6.5%), the increased
memory impact is almost negligible when taking into account the vastly increased performance. 
