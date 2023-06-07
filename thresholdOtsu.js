/*
declaration: function otsuThreshold(histogram):
This function was made to find the optimum threshold of a grey scaled image (single band)
Source: Otsu, N. 1979. “A Threshold Selection Method from Gray-Level Histograms.” 
IEEE Transactions on Systems, Man, and Cybernetics 9 (1): 62–66. https://doi.org/10.1109/TSMC.1979.4310076.

    list of parametres:
    • histogram: an histogram found with:
        var histogram = image.reduceRegion({
          reducer: ee.Reducer.histogram(),
          geometry: geometry, 
          scale: 10
        });
        var imageHist = histogram.get('bandName');
      
      • image: the name of the dingle band image
      • bandName: the name of the band in your image
      
    global variables: (none)
    libraries needed: (none)
    return value: threshold value
*/

var otsuThreshold = function(histogram) {
    var counts = ee.Array(ee.Dictionary(imageHist).get('histogram')); 
    var means = ee.Array(ee.Dictionary(imageHist).get('bucketMeans')); 
    var size = means.length().get([0]);
    var total = counts.reduce(ee.Reducer.sum(), [0]).get([0]);
    var sum = means.multiply(counts).reduce(ee.Reducer.sum(), [0]).get([0]);
    var mean = sum.divide(total);
  
    var indices = ee.List.sequence(1, size);
    
    // Compute between sum of squares, where each mean partitions the data.
    var bss = indices.map(function(i) {
      var aCounts = counts.slice(0, 0, i);
      var aCount = aCounts.reduce(ee.Reducer.sum(), [0]).get([0]);
      var aMeans = means.slice(0, 0, i);
      var aMean = aMeans.multiply(aCounts)
          .reduce(ee.Reducer.sum(), [0]).get([0])
          .divide(aCount);
      var bCount = total.subtract(aCount);
      var bMean = sum.subtract(aCount.multiply(aMean)).divide(bCount);
      return aCount.multiply(aMean.subtract(mean).pow(2)).add(
            bCount.multiply(bMean.subtract(mean).pow(2)));
    });
  
    //print(ui.Chart.array.values(ee.Array(bss), 0, means));
    print('the threshold is:    ', threshold);
  
    // Return the mean value corresponding to the maximum BSS.
    return means.sort(bss).get([-1]);
  };