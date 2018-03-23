const launchPage = () => {
    const db = firebase.app().database();
    var VM = function() {
        const self = this;
        const url = window.location.pathname;
        
        self.isLoading = ko.observable(true);
        self.data = ko.observable();
        self.init = () => {
            let id = url.replace('/', '');
            console.info("Loading " + id);
            db.ref('page/' + id).once('value').then(snap => {
                const val = snap.val();

                if (!val) {
                    window.location.href = "/404.html";
                }

                self.data(val);

                console.log(val);
            })
            .catch(e => console.error(e))
            .then(() => self.isLoading(false));
        }
    }

    var vm = new VM();
    ko.applyBindings(vm);
    vm.init();
}

var AuthVM = function(fb) {
    const self = this;
    
    self.isLoggedIn = ko.observable(false);
    self.user = ko.observable();
    self.pageId = ko.observable();

    fb.auth().onAuthStateChanged(user => {
        if (user) {
            console.info('Logged in.');
            self.isLoggedIn(true);
            self.user(user);
            self.initUser();
        }
        else {
            console.info('Logged out.')
            self.isLoggedIn(false);
            self.user();
        }
    });

    self.initUser = () => {
        console.info('Start init user');
        var ref = fb.database().ref('user/' + value.uid);
        
        ref.once('value', snap => {
            var val = snap.val()
            if (!val) {
                var newVal = {
                    
                }
            }
            console.info('Received user page id ' + pageId);
            self.pageId(pageId);
        })
    }

    self.user.subscribe(value => {
        fb.database().ref('user/' + value.uid).on('value', snap => {
            var pageId = snap.val().pageId;
            console.info('Received user page id ' + pageId);
            self.pageId(pageId);
        })
    })

    self.init = () => {

    }

    self.signIn = () => {
        var uiConfig = {
            signInSuccessUrl: '/',
            signInOptions: [
              // Leave the lines as is for the providers you want to offer your users.
              firebase.auth.GoogleAuthProvider.PROVIDER_ID,
              firebase.auth.FacebookAuthProvider.PROVIDER_ID,
              firebase.auth.TwitterAuthProvider.PROVIDER_ID,
              firebase.auth.GithubAuthProvider.PROVIDER_ID,
              firebase.auth.EmailAuthProvider.PROVIDER_ID,
              firebase.auth.PhoneAuthProvider.PROVIDER_ID
            ],
            // Terms of service url.
            tosUrl: 'http://test.com'
        };
    
        // Initialize the FirebaseUI Widget using Firebase.
        var ui = new firebaseui.auth.AuthUI(fb.auth());
        ui.start("#auth-container", uiConfig);
    }
}

var EditPageFormVM = function (onSubmit) {
    const self = this;

    self.name = ko.observable('');
    self.message = ko.observable('');
    self.charities = ko.observable([]);

    self.onSubmit = () => {
        var model = {
            name: self.name(),
            message: self.message(),
            charities: self.charities()
        }

        onSubmit(model);
    }
}

var EditPageVM = function(fb, pageId) {
    if (!fb) {
        throw new Error('Firebase not initilized.');
    }

    const self = this;
    self.data = ko.observable({});
    self.onSubmit = (model) => {
        fb.database().ref('page/')
    }
    self.page = new EditPageFormVM();

    userObservable.subscribe(value => {
        fb.database().ref('user/' + value.uid).on('value', snap => {
            self.data(snap.val());
        })
    })

}

var HomeVM = function(fb) {
    if (!fb) {
        throw new Error('Firebase not initilized.');
    }

    const self = this;
    
    self.auth = new AuthVM(fb);
    self.page = new EditPageVM(fb, self.auth.pageId);

    self.init = () => {
        self.auth.init();
    }
}

const launchHome = (fb) => {
    var vm = new HomeVM(fb);
    vm.init();
    ko.applyBindings(vm);
}
