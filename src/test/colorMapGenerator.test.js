const colorMap = require('./../colorMapGenerator.js');
const colors = require('./../colors.js');

function testColorMap() {
    describe('ColorMap tests', () => {

        test('Test of one variation along red color with correct values', () => {
	    const gradient = colorMap.colorMap({f:(x,y)=>x,min:0,max:50,redVariations:[[0,255]],greenVariations:[[0]],blueVariations:[[0]],alphaVariations:[[0]]});
	    let color = gradient(0,5);
	    expect(colors.compareColor(color,colors.createColor(0,0,0,0))).toEqual(true);           
	});

	test('Test of one variation along green color with incorrect values', () => {
	    const gradient = colorMap.colorMap({f:(x,y)=>x,min:0,max:50,redVariations:[[255]],greenVariations:[[0,255]],blueVariations:[[0]],alphaVariations:[[0]]});
	    let color = gradient(55,5);
	    expect(colors.compareColor(color,colors.createColor(255,25.5,0,0))).toEqual(true);           
	});

	test('Test of one specific variation per colors with correct values', () => {
	    const gradient = colorMap.colorMap({f:(x,y)=>x,min:0,max:50,redVariations:[[0,255]],greenVariations:[[0,50]],blueVariations:[[0,255]],alphaVariations:[[0,100]]});
	    let color = gradient(10,5);
	    expect(colors.compareColor(color,colors.createColor(50,9,50,19))).toEqual(true);           
	});

	test('Test of one specific variation per colors with incorrect values', () => {
	    const gradient = colorMap.colorMap({f:(x,y)=>x,min:0,max:50,redVariations:[[0,80]],greenVariations:[[0,50]],blueVariations:[[10,255]],alphaVariations:[[5,100]]});
	    let color = gradient(62,5);
	    expect(colors.compareColor(color,colors.createColor(19.2,11,68.8,27.8))).toEqual(true);           
	});

	test('Test of multi specific variations per colors with correct values', () => {
	    const gradient = colorMap.colorMap({f:(x,y)=>y,min:0,max:50,redVariations:[[0,80],[127,50]],greenVariations:[[0,50],[0,10],[56,255]],blueVariations:[[10,255],[245,60]],alphaVariations:[[5,100]]});
	    let color = gradient(10,22);
	    expect(colors.compareColor(color,colors.createColor(69,3.2,223,46))).toEqual(true);           
	});

	test('Test of multi specific variations per colors with incorrect values and reversed gradient', () => {
	    const gradient = colorMap.colorMap({f:(x,y)=>{return x*y;},min:80,max:-20,redVariations:[[0,52],[67,50],[127,140]],greenVariations:[[222,56],[56,222]],blueVariations:[[15,255],[232,62]],alphaVariations:[[0,255]]});
	    let color = gradient(10,8.8);

	    expect(colors.compareColor(color,colors.createColor(136.91,195.70,88.93,234.80))).toEqual(true);           
	});
    });  
}

testColorMap();

