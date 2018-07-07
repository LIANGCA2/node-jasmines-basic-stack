'use strict';


const {loadAllItems, loadPromotions} = require('../spec/fixtures');

function printReceipt(tags) {
    let cartItemsArray = calculateByItemsNumber(tags);
    let cartItemWithDetailArray = calCartItemsWithDetail(cartItemsArray, loadAllItems());
    let sum = calculateCartItemSubTotalSum(cartItemWithDetailArray);
    let saveMoneySum = saveItemMoneySum(cartItemWithDetailArray, sum);
    let receipt = generateReceipt(cartItemWithDetailArray, sum, saveMoneySum);
    console.log(receipt);
}


function buildCartItem(tags) {
    return tags.map((tag) => {
        if (tag.indexOf('-') !== -1) {
            let [barcode, count] = tag.split('-');
            return {
                barcode,
                count: parseFloat(count)
            }
        } else {
            return {
                barcode: tag,
                count: 1
            }
        }
    })
}

function mergeCartItem(cartItemList) {
    let cartItemsMap = [];
    cartItemList.forEach((cartItem) => {
        const {barcode, count} = cartItem;
        let existItem = findItemByBarcode(cartItemsMap, cartItem.barcode);
        if (existItem != null) {
            existItem.count = count + existItem.count;
        } else {
            cartItemsMap.push({
                barcode,
                count,
            })
        }
    });
    return cartItemsMap;
}


function calculateByItemsNumber(tags) {
    let cartItemList = buildCartItem(tags);
    return mergeCartItem(cartItemList);
}

function calculateSummary(item, count) {
    if (loadPromotions()[0].barcodes.includes(item.barcode)) {
        return item.price * (parseInt(count/3) * 2 + (count % 3));
    }
    else {
        return item.price * parseFloat(count);
    }
}

function findItemByBarcode(allItems, barcode) {
    return allItems.find((item) => {
        return item.barcode === barcode;
    });
}

function calCartItemsWithDetail(cartItemsArray, allItems) {
    return cartItemsArray.map((cartItem) => {
        const {barcode, count} = cartItem;
        const item = findItemByBarcode(allItems, cartItem.barcode);
        const {name, price, unit} = item;
        console.info(barcode);
        return {
            name,
            count: count,
            price,
            summary: calculateSummary(item, count),
            unit
        }
    })
}

function calculateCartItemSubTotalSum(cartItemWithDetailArray) {
    let sum = 0;
    cartItemWithDetailArray.forEach((item) => {
        sum += item.summary;
    });
    return sum;
}

function saveItemMoneySum(cartItemWithDetailArray, sum) {
    let originalPrice = 0;
    cartItemWithDetailArray.forEach((item) => {
        originalPrice += item.count * item.price;
    });
    return originalPrice - sum;
}

function generateReceipt(buyItemWithDetail, sum, saveMoneySum) {
    let receipt = `***<没钱赚商店>收据***`;
    for (let buyItem of buyItemWithDetail) {
        receipt += `\n名称：${buyItem.name}，数量：${buyItem.count}${buyItem.unit}，单价：${buyItem.price.toFixed(2)}(元)，小计：${buyItem.summary.toFixed(2)}(元)`
    }
    receipt += `\n----------------------
总计：${sum.toFixed(2)}(元)
节省：${saveMoneySum.toFixed(2)}(元)
**********************`;
    return receipt;
}

module.exports = {
    printReceipt,
    buildCartItem,
    mergeCartItem,
    calculateByItemsNumber,
    calculateSummary,
    calCartItemsWithDetail,
    calculateCartItemSubTotalSum,
    saveItemMoneySum,
    generateReceipt
};