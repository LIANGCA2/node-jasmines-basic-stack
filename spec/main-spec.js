const main = require('../main/main');
const { printReceipt,buildCartItem,mergeCartItem,calculateByItemsNumber,calculateSummary,calCartItemsWithDetail,calculateCartItemSubTotalSum,saveItemMoneySum,generateReceipt} = require('../main/main');
const {loadAllItems,loadPromotions} = require('../spec/fixtures')
describe('calCartItemsWithDetail', () => {

        it('should print array', () => {
          const list = [{
              barcode:'ITEM000000',
              count:3
          },
              {
                  barcode:'ITEM000001',
                  count:2
              }]
           let result =  JSON.stringify(mergeCartItem(list));
        const expectText = JSON.stringify(
            [{
                barcode:'ITEM000000',
                count:3
            },
                {
                    barcode:'ITEM000001',
                    count:2
                }]);

        expect(result).toBe(expectText);
    });






    it('should print array', () => {

        const cartItemsArray = [{
            barcode:'ITEM000000',
            count:3
        },{
          barcode:'ITEM000001',
          count:2
        }];
        const allItems = loadAllItems();

        let buyItemWithDetail = JSON.stringify( calCartItemsWithDetail(cartItemsArray,allItems))


        const expectText = JSON.stringify(
            [{name:'可口可乐',count:3,price:3.00,summary:6.00,unit:'瓶'},{name:'雪碧',count:2,price:3.00,summary:6.00,unit:'瓶'}]
        );

        expect(buyItemWithDetail).toBe(expectText);
    });


    it('should print map', () => {

        const tags = [
            'ITEM000000',
            'ITEM000001',
            'ITEM000000',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2.5',
            'ITEM000005',
            'ITEM000005-2',
        ];

        let cartItemsMap = JSON.stringify(calculateByItemsNumber(tags));

        const expectText = JSON.stringify([
            {
                barcode:'ITEM000000',
            count:2
            },
            {
                barcode:'ITEM000001',
                count:3
            },
            {
                barcode:'ITEM000003',
                count:2.5
            },{
                barcode:'ITEM000005',
                count:3
            }
        ]);

        expect(cartItemsMap).toBe(expectText);
    });

    it('should print number', () => {

        const cartItemList = [{name:'可口可乐',count:2,price:3.00,summary:6.00,unit:'瓶'},{name:'雪碧',count:1,price:3.00,summary:3.00,unit:'瓶'}];

        let sum = JSON.stringify(calculateCartItemSubTotalSum(cartItemList))


        const expectText = JSON.stringify(
            9.00
        );

        expect(sum).toBe(expectText);
    });


        it('should print text', () => {

            const itemList = [{name:'苹果',count:2.5,price:5.50,summary:13.75,unit:'斤'},{name:'方便面',count:3,price:4.50,summary:9.00,unit:'袋'}];
            const sum =22.75;
            const saveSum =4.50;
            let text = generateReceipt(itemList,sum,saveSum);


            const expectText = `***<没钱赚商店>收据***
名称：苹果，数量：2.5斤，单价：5.50(元)，小计：13.75(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：22.75(元)
节省：4.50(元)
**********************`;

            expect(text).toBe(expectText);
        });

    it('should print text', () => {

        const tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2.5',
            'ITEM000005',
            'ITEM000005-2',
        ];

        spyOn(console, 'log');

        printReceipt(tags);

        const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

        expect(console.log).toHaveBeenCalledWith(expectText);
    });


    it('should print number', () => {

        const itemList = [{name:'苹果',count:2.5,price:5.50,summary:13.75,unit:'斤'},{name:'方便面',count:3,price:4.50,summary:9.00,unit:'袋'}];
        const sum = 22.75;

        let saveMoney = JSON.stringify(saveItemMoneySum(itemList,sum))


        const expectText = JSON.stringify(
            4.50
        );

        expect(saveMoney).toBe(expectText);
    });

});
