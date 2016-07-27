SystemJS.config({
	paths: {
		"github:": "jspm_packages/github/",
		"npm:": "jspm_packages/npm/"
	},
	browserConfig: {
		"baseURL": "/",
		"paths": {
			"src": "./"
		}
	},
	devConfig: {
		"map": {
			"escher-vis": "npm:escher-vis@1.4.4"
		},
		"packages": {
			"npm:escher-vis@1.4.4": {
				"map": {
					"d3": "npm:d3@3.5.17",
					"filesaverjs": "npm:filesaverjs@0.2.2",
					"underscore": "npm:underscore@1.8.3",
					"baconjs": "npm:baconjs@0.7.84",
					"mousetrap": "npm:mousetrap@1.6.0",
					"vkbeautify": "npm:vkbeautify@0.99.1"
				}
			}
		}
	},
	packages: {
		"src": {
			"defaultExtension": "js",
			"main": "./index.js"
		}
	}
});

SystemJS.config({
	packageConfigPaths: [
		"github:*/*.json",
		"npm:@*/*.json",
		"npm:*.json"
	],
	map: {
		"angular": "github:angular/bower-angular@1.5.7",
		"angular-material": "github:angular/bower-material@1.0.9",
		"angular-ui-router": "github:angular-ui/angular-ui-router-bower@0.3.1",
		"assert": "github:jspm/nodelibs-assert@0.2.0-alpha",
		"buffer": "github:jspm/nodelibs-buffer@0.2.0-alpha",
		"child_process": "github:jspm/nodelibs-child_process@0.2.0-alpha",
		"constants": "github:jspm/nodelibs-constants@0.2.0-alpha",
		"crypto": "github:jspm/nodelibs-crypto@0.2.0-alpha",
		"css": "github:systemjs/plugin-css@0.1.23",
		"d3": "npm:d3@3.5.6",
		"decaf-common": "github:biosustain/decaf-frontend-common@master",
		"events": "github:jspm/nodelibs-events@0.2.0-alpha",
		"fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
		"http": "github:jspm/nodelibs-http@0.2.0-alpha",
		"https": "github:jspm/nodelibs-https@0.2.0-alpha",
		"jquery": "npm:jquery@3.1.0",
		"path": "github:jspm/nodelibs-path@0.2.0-alpha",
		"process": "github:jspm/nodelibs-process@0.2.0-alpha",
		"stream": "github:jspm/nodelibs-stream@0.2.0-alpha",
		"string_decoder": "github:jspm/nodelibs-string_decoder@0.2.0-alpha",
		"twbs-bootstrap": "github:twbs/bootstrap@3.3.7",
		"url": "github:jspm/nodelibs-url@0.2.0-alpha",
		"util": "github:jspm/nodelibs-util@0.2.0-alpha",
		"vm": "github:jspm/nodelibs-vm@0.2.0-alpha"
	},
	packages: {
		"github:angular/bower-material@1.0.9": {
			"map": {
				"css": "github:systemjs/plugin-css@0.1.23",
				"angular-aria": "github:angular/bower-angular-aria@1.5.7",
				"angular-animate": "github:angular/bower-angular-animate@1.5.7",
				"angular": "github:angular/bower-angular@1.5.7"
			}
		},
		"github:angular/bower-angular-aria@1.5.7": {
			"map": {
				"angular": "github:angular/bower-angular@1.5.7"
			}
		},
		"github:angular/bower-angular-animate@1.5.7": {
			"map": {
				"angular": "github:angular/bower-angular@1.5.7"
			}
		},
		"github:angular-ui/angular-ui-router-bower@0.3.1": {
			"map": {
				"angular": "github:angular/bower-angular@1.5.7"
			}
		},
		"github:jspm/nodelibs-http@0.2.0-alpha": {
			"map": {
				"http-browserify": "npm:stream-http@2.3.0"
			}
		},
		"github:jspm/nodelibs-url@0.2.0-alpha": {
			"map": {
				"url-browserify": "npm:url@0.11.0"
			}
		},
		"github:jspm/nodelibs-buffer@0.2.0-alpha": {
			"map": {
				"buffer-browserify": "npm:buffer@4.7.1"
			}
		},
		"npm:stream-http@2.3.0": {
			"map": {
				"builtin-status-codes": "npm:builtin-status-codes@2.0.0",
				"to-arraybuffer": "npm:to-arraybuffer@1.0.1",
				"inherits": "npm:inherits@2.0.1",
				"xtend": "npm:xtend@4.0.1",
				"readable-stream": "npm:readable-stream@2.1.4"
			}
		},
		"npm:url@0.11.0": {
			"map": {
				"querystring": "npm:querystring@0.2.0",
				"punycode": "npm:punycode@1.3.2"
			}
		},
		"npm:buffer@4.7.1": {
			"map": {
				"ieee754": "npm:ieee754@1.1.6",
				"base64-js": "npm:base64-js@1.1.2",
				"isarray": "npm:isarray@1.0.0"
			}
		},
		"npm:readable-stream@2.1.4": {
			"map": {
				"inherits": "npm:inherits@2.0.1",
				"isarray": "npm:isarray@1.0.0",
				"buffer-shims": "npm:buffer-shims@1.0.0",
				"process-nextick-args": "npm:process-nextick-args@1.0.7",
				"core-util-is": "npm:core-util-is@1.0.2",
				"util-deprecate": "npm:util-deprecate@1.0.2",
				"string_decoder": "npm:string_decoder@0.10.31"
			}
		},
		"github:jspm/nodelibs-crypto@0.2.0-alpha": {
			"map": {
				"crypto-browserify": "npm:crypto-browserify@3.11.0"
			}
		},
		"npm:crypto-browserify@3.11.0": {
			"map": {
				"inherits": "npm:inherits@2.0.1",
				"browserify-cipher": "npm:browserify-cipher@1.0.0",
				"create-ecdh": "npm:create-ecdh@4.0.0",
				"create-hmac": "npm:create-hmac@1.1.4",
				"public-encrypt": "npm:public-encrypt@4.0.0",
				"create-hash": "npm:create-hash@1.1.2",
				"randombytes": "npm:randombytes@2.0.3",
				"diffie-hellman": "npm:diffie-hellman@5.0.2",
				"pbkdf2": "npm:pbkdf2@3.0.4",
				"browserify-sign": "npm:browserify-sign@4.0.0"
			}
		},
		"npm:create-hmac@1.1.4": {
			"map": {
				"inherits": "npm:inherits@2.0.1",
				"create-hash": "npm:create-hash@1.1.2"
			}
		},
		"npm:create-hash@1.1.2": {
			"map": {
				"inherits": "npm:inherits@2.0.1",
				"cipher-base": "npm:cipher-base@1.0.2",
				"ripemd160": "npm:ripemd160@1.0.1",
				"sha.js": "npm:sha.js@2.4.5"
			}
		},
		"npm:public-encrypt@4.0.0": {
			"map": {
				"create-hash": "npm:create-hash@1.1.2",
				"randombytes": "npm:randombytes@2.0.3",
				"browserify-rsa": "npm:browserify-rsa@4.0.1",
				"parse-asn1": "npm:parse-asn1@5.0.0",
				"bn.js": "npm:bn.js@4.11.5"
			}
		},
		"npm:diffie-hellman@5.0.2": {
			"map": {
				"randombytes": "npm:randombytes@2.0.3",
				"miller-rabin": "npm:miller-rabin@4.0.0",
				"bn.js": "npm:bn.js@4.11.5"
			}
		},
		"npm:pbkdf2@3.0.4": {
			"map": {
				"create-hmac": "npm:create-hmac@1.1.4"
			}
		},
		"npm:browserify-sign@4.0.0": {
			"map": {
				"inherits": "npm:inherits@2.0.1",
				"create-hash": "npm:create-hash@1.1.2",
				"create-hmac": "npm:create-hmac@1.1.4",
				"browserify-rsa": "npm:browserify-rsa@4.0.1",
				"parse-asn1": "npm:parse-asn1@5.0.0",
				"elliptic": "npm:elliptic@6.3.1",
				"bn.js": "npm:bn.js@4.11.5"
			}
		},
		"npm:browserify-cipher@1.0.0": {
			"map": {
				"browserify-des": "npm:browserify-des@1.0.0",
				"evp_bytestokey": "npm:evp_bytestokey@1.0.0",
				"browserify-aes": "npm:browserify-aes@1.0.6"
			}
		},
		"npm:browserify-des@1.0.0": {
			"map": {
				"inherits": "npm:inherits@2.0.1",
				"cipher-base": "npm:cipher-base@1.0.2",
				"des.js": "npm:des.js@1.0.0"
			}
		},
		"npm:create-ecdh@4.0.0": {
			"map": {
				"elliptic": "npm:elliptic@6.3.1",
				"bn.js": "npm:bn.js@4.11.5"
			}
		},
		"npm:browserify-aes@1.0.6": {
			"map": {
				"inherits": "npm:inherits@2.0.1",
				"cipher-base": "npm:cipher-base@1.0.2",
				"create-hash": "npm:create-hash@1.1.2",
				"evp_bytestokey": "npm:evp_bytestokey@1.0.0",
				"buffer-xor": "npm:buffer-xor@1.0.3"
			}
		},
		"npm:cipher-base@1.0.2": {
			"map": {
				"inherits": "npm:inherits@2.0.1"
			}
		},
		"npm:evp_bytestokey@1.0.0": {
			"map": {
				"create-hash": "npm:create-hash@1.1.2"
			}
		},
		"npm:browserify-rsa@4.0.1": {
			"map": {
				"randombytes": "npm:randombytes@2.0.3",
				"bn.js": "npm:bn.js@4.11.5"
			}
		},
		"npm:parse-asn1@5.0.0": {
			"map": {
				"browserify-aes": "npm:browserify-aes@1.0.6",
				"create-hash": "npm:create-hash@1.1.2",
				"evp_bytestokey": "npm:evp_bytestokey@1.0.0",
				"pbkdf2": "npm:pbkdf2@3.0.4",
				"asn1.js": "npm:asn1.js@4.8.0"
			}
		},
		"npm:sha.js@2.4.5": {
			"map": {
				"inherits": "npm:inherits@2.0.1"
			}
		},
		"npm:elliptic@6.3.1": {
			"map": {
				"inherits": "npm:inherits@2.0.1",
				"bn.js": "npm:bn.js@4.11.5",
				"brorand": "npm:brorand@1.0.5",
				"hash.js": "npm:hash.js@1.0.3"
			}
		},
		"npm:miller-rabin@4.0.0": {
			"map": {
				"bn.js": "npm:bn.js@4.11.5",
				"brorand": "npm:brorand@1.0.5"
			}
		},
		"npm:des.js@1.0.0": {
			"map": {
				"inherits": "npm:inherits@2.0.1",
				"minimalistic-assert": "npm:minimalistic-assert@1.0.0"
			}
		},
		"npm:asn1.js@4.8.0": {
			"map": {
				"inherits": "npm:inherits@2.0.1",
				"bn.js": "npm:bn.js@4.11.5",
				"minimalistic-assert": "npm:minimalistic-assert@1.0.0"
			}
		},
		"npm:hash.js@1.0.3": {
			"map": {
				"inherits": "npm:inherits@2.0.1"
			}
		},
		"github:jspm/nodelibs-stream@0.2.0-alpha": {
			"map": {
				"stream-browserify": "npm:stream-browserify@2.0.1"
			}
		},
		"npm:stream-browserify@2.0.1": {
			"map": {
				"inherits": "npm:inherits@2.0.1",
				"readable-stream": "npm:readable-stream@2.1.4"
			}
		},
		"github:jspm/nodelibs-string_decoder@0.2.0-alpha": {
			"map": {
				"string_decoder-browserify": "npm:string_decoder@0.10.31"
			}
		},
		"github:twbs/bootstrap@3.3.7": {
			"map": {
				"jquery": "npm:jquery@2.2.4"
			}
		}
	}
});
