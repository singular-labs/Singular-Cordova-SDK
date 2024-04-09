function SingularIAP(product) {
    this.ppc = product.currency;
    this.r = Number((product && product.price && product.price.replace(/[^0-9.-]+/g, "")) || 0);
    this.is_revenue_event = true;

    if (product && product.transaction && product.transaction.type === 'android-playstore') {
        this.ptr = product.transaction.receipt;
        this.receipt = product.transaction.receipt;
        this.receipt_signature = product.transaction.signature;
    }

    if (product && product.transaction && product.transaction.type === 'ios-appstore') {
        this.ptr = product.transaction.appStoreReceipt;
        this.pti = product.transaction.id;
        this.pk = product.id;
    }
}

module.exports = SingularIAP;
