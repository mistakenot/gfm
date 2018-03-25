ko.components.register('charity-dontate-card', {
    viewModel: function(params) {
        const self = this;

        this.charityId = params.charityId;
        this.amount = params.amount;

        self.isLoading = ko.observable(true);
        self.imageUrl = ko.observable('');
        self.siteUrl = ko.observable('');
        self.title = ko.observable('');
        self.description = ko.observable('');

        this.subFive = function() {
            var next = this.amount() + 5;
            this.amount(next).bind(this);
        }
        this.subTen = function() {
            var next = this.amount() + 10;
            this.amount(next).bind(this);
        }
        this.addFive = function() {
            var next = this.amount() + 5;
            this.amount(next).bind(this);
        }
        this.addTen = function() {
            var next = this.amount() + 10;
            this.amount(next).bind(this);
        }
        this.init = function() {
            console.info('charity/' + params.charityId);
            firebase.app().database().ref('charity/' + params.charityId).once('value').then(snap => {
                var val = snap.val();
                console.info(snap.val());
                self.imageUrl(val.imageUrl);
                self.siteUrl(val.siteUrl);
                self.title(val.name);
                self.description(val.description);
            })
            .then(() => self.isLoading(false));
        }

        this.init();
    },
    template: `
        <div class="card" style="width: 18rem;">
            <div data-bind="if: isLoading">
                <div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div>
                </div>
            </div>
            <div data-bind="ifnot: isLoading">
                <div class="card-img-top">
                    <a data-bind="attr: {href: siteUrl}" href="">
                        <img data-bind="attr: {src: imageUrl}" class="card-img-top" src="..." alt="Card image cap">
                    </a>
                </div>
                <div class="card-body">
                    <h5 data-bind="text: title" class="card-title"></h5>
                    <p data-bind="text: description" class="card-text"></p>
                </div>
                <div class="card-footer text-muted">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-secondary" type="button">-$5</button>
                        </div>
                        <input data-bind="value: amount" type="number" class="form-control text-center" aria-label="Amount (to the nearest dollar)">
                        <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon2">$</span>
                            <button class="btn btn-secondary" type="button">+$5</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
})