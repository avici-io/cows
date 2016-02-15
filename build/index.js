_c$606 = function () {
    'use strict';
    if (typeof require === 'function') {
        // importing patches Proxy to be in line with the new direct proxies
        require('harmony-reflect');
    }
    var unproxy$2034 = new WeakMap();
    var typeVarMap$2035 = new WeakMap();
    var Blame$2036 = {
        create: function (name$2057, pos$2058, neg$2059, lineNumber$2060) {
            var o$2061 = new BlameObj$2037(name$2057, pos$2058, neg$2059, lineNumber$2060);
            return o$2061;
        },
        clone: function (old$2062, props$2063) {
            var o$2064 = new BlameObj$2037(typeof props$2063.name !== 'undefined' ? props$2063.name : old$2062.name, typeof props$2063.pos !== 'undefined' ? props$2063.pos : old$2062.pos, typeof props$2063.neg !== 'undefined' ? props$2063.neg : old$2062.neg, typeof props$2063.lineNuber !== 'undefined' ? props$2063.lineNuber : old$2062.lineNumber);
            o$2064.expected = typeof props$2063.expected !== 'undefined' ? props$2063.expected : old$2062.expected;
            o$2064.given = typeof props$2063.given !== 'undefined' ? props$2063.given : old$2062.given;
            o$2064.loc = typeof props$2063.loc !== 'undefined' ? props$2063.loc : old$2062.loc;
            o$2064.parents = typeof props$2063.parents !== 'undefined' ? props$2063.parents : old$2062.parents;
            return o$2064;
        }
    };
    function BlameObj$2037(name$2065, pos$2066, neg$2067, lineNumber$2068) {
        this.name = name$2065;
        this.pos = pos$2066;
        this.neg = neg$2067;
        this.lineNumber = lineNumber$2068;
    }
    BlameObj$2037.prototype.swap = function () {
        return Blame$2036.clone(this, {
            pos: this.neg,
            neg: this.pos
        });
    };
    BlameObj$2037.prototype.addExpected = function (expected$2069, override$2070) {
        if (this.expected === undefined || override$2070) {
            return Blame$2036.clone(this, { expected: expected$2069 });
        }
        return Blame$2036.clone(this, {});
    };
    BlameObj$2037.prototype.addGiven = function (given$2071) {
        return Blame$2036.clone(this, { given: given$2071 });
    };
    BlameObj$2037.prototype.addLocation = function (loc$2072) {
        return Blame$2036.clone(this, { loc: this.loc != null ? this.loc.concat(loc$2072) : [loc$2072] });
    };
    BlameObj$2037.prototype.addParents = function (parent$2073) {
        return Blame$2036.clone(this, { parents: this.parents != null ? this.parents.concat(parent$2073) : [parent$2073] });
    };
    BlameObj$2037.prototype.setNeg = function (neg$2074) {
        return Blame$2036.clone(this, { neg: neg$2074 });
    };
    function assert$2038(cond$2075, msg$2076) {
        if (!cond$2075) {
            throw new Error(msg$2076);
        }
    }
    function Contract$2039(name$2077, type$2078, proj$2079) {
        this.name = name$2077;
        this.type = type$2078;
        this.proj = proj$2079.bind(this);
    }
    Contract$2039.prototype.closeCycle = function closeCycle(contract$2080) {
        this.cycleContract = contract$2080;
        return contract$2080;
    };
    Contract$2039.prototype.toString = function toString() {
        return this.name;
    };
    function addQuotes$2040(val$2081) {
        if (typeof val$2081 === 'string') {
            return '\'' + val$2081 + '\'';
        }
        return val$2081;
    }
    function raiseBlame$2041(blame$2082) {
        var lineMessage$2083 = blame$2082.lineNumber !== undefined ? 'function ' + blame$2082.name + ' guarded at line: ' + blame$2082.lineNumber + '\n' : '';
        var msg$2084 = blame$2082.name + ': contract violation\n' + 'expected: ' + blame$2082.expected + '\n' + 'given: ' + addQuotes$2040(blame$2082.given) + '\n' + 'in: ' + blame$2082.loc.slice().reverse().join('\n    ') + '\n' + '    ' + blame$2082.parents[0] + '\n' + lineMessage$2083 + 'blaming: ' + blame$2082.pos + '\n';
        throw new Error(msg$2084);
    }
    function makeCoffer$2042(name$2085) {
        return new Contract$2039(name$2085, 'coffer', function (blame$2086, unwrapTypeVar$2087, projOptions$2088) {
            return function (val$2089) {
                var locationMsg$2090 = 'in the type variable ' + name$2085 + ' of';
                if (unwrapTypeVar$2087) {
                    if (val$2089 && typeof val$2089 === 'object' && unproxy$2034.has(val$2089)) {
                        var unwraperProj$2091 = typeVarMap$2035.get(this).contract.proj(blame$2086.addLocation(locationMsg$2090));
                        return unwraperProj$2091(unproxy$2034.get(val$2089));
                    } else {
                        raiseBlame$2041(blame$2086.addExpected('an opaque value').addGiven(val$2089).addLocation(locationMsg$2090));
                    }
                } else {
                    var towrap$2092 = val$2089 && typeof val$2089 === 'object' ? val$2089 : {};
                    var p$2093 = new Proxy(towrap$2092, {
                        getOwnPropertyDescriptor: function () {
                            raiseBlame$2041(blame$2086.swap().addExpected('value to not be manipulated').addGiven('called Object.getOwnPropertyDescriptor').addLocation(locationMsg$2090));
                        },
                        getOwnPropertyName: function () {
                            raiseBlame$2041(blame$2086.swap().addExpected('value to not be manipulated').addGiven('called Object.getOwnPropertyName').addLocation(locationMsg$2090));
                        },
                        defineProperty: function () {
                            raiseBlame$2041(blame$2086.swap().addExpected('value to not be manipulated').addGiven('called Object.defineProperty').addLocation(locationMsg$2090));
                        },
                        deleteProperty: function (target$2094, propName$2095) {
                            raiseBlame$2041(blame$2086.swap().addExpected('value to not be manipulated').addGiven('called delete on property' + propName$2095).addLocation(locationMsg$2090));
                        },
                        freeze: function () {
                            raiseBlame$2041(blame$2086.swap().addExpected('value to not be manipulated').addGiven('called Object.freeze').addLocation(locationMsg$2090));
                        },
                        seal: function () {
                            raiseBlame$2041(blame$2086.swap().addExpected('value to not be manipulated').addGiven('called Object.seal').addLocation(locationMsg$2090));
                        },
                        preventExtensions: function () {
                            raiseBlame$2041(blame$2086.swap().addExpected('value to not be manipulated').addGiven('called Object.preventExtensions').addLocation(locationMsg$2090));
                        },
                        has: function (target$2096, propName$2097) {
                            raiseBlame$2041(blame$2086.swap().addExpected('value to not be manipulated').addGiven('called `in` for property ' + propName$2097).addLocation(locationMsg$2090));
                        },
                        hasOwn: function (target$2098, propName$2099) {
                            raiseBlame$2041(blame$2086.swap().addExpected('value to not be manipulated').addGiven('called Object.hasOwnProperty on property ' + propName$2099).addLocation(locationMsg$2090));
                        },
                        get: function (target$2100, propName$2101) {
                            var givenMsg$2102 = 'performed obj.' + propName$2101;
                            if (propName$2101 === 'valueOf') {
                                givenMsg$2102 = 'attempted to inspect the value';
                            }
                            raiseBlame$2041(blame$2086.swap().addExpected('value to not be manipulated').addGiven(givenMsg$2102).addLocation(locationMsg$2090));
                        },
                        set: function (target$2103, propName$2104, val$2$2105) {
                            raiseBlame$2041(blame$2086.swap().addExpected('value to not be manipulated').addGiven('performed obj.' + propName$2104 + ' = ' + val$2$2105).addLocation(locationMsg$2090));
                        },
                        enumerate: function () {
                            raiseBlame$2041(blame$2086.swap().addExpected('value to not be manipulated').addGiven('value used in a `for in` loop').addLocation(locationMsg$2090));
                        },
                        iterate: function () {
                            raiseBlame$2041(blame$2086.swap().addExpected('value to not be manipulated').addGiven('value used in a `for of` loop').addLocation(locationMsg$2090));
                        },
                        keys: function () {
                            raiseBlame$2041(blame$2086.swap().addExpected('value to not be manipulated').addGiven('called Object.keys').addLocation(locationMsg$2090));
                        },
                        apply: function () {
                            raiseBlame$2041(blame$2086.swap().addExpected('value to not be manipulated').addGiven('attempted to invoke the value').addLocation(locationMsg$2090));
                        },
                        construct: function () {
                            raiseBlame$2041(blame$2086.swap().addExpected('value to not be manipulated').addGiven('attempted to invoke the value with new').addLocation(locationMsg$2090));
                        }
                    });
                    if (!typeVarMap$2035.has(this)) {
                        var valType$2106 = typeof val$2089;
                        var inferedContract$2107 = check$2043(function (checkVal$2108) {
                            return typeof checkVal$2108 === valType$2106;
                        }, '(x) => typeof x === \'' + valType$2106 + '\'');
                        typeVarMap$2035.set(this, { contract: inferedContract$2107 });
                    } else {
                        var inferedProj$2109 = typeVarMap$2035.get(this).contract.proj(blame$2086.addLocation(locationMsg$2090));
                        inferedProj$2109(val$2089);
                    }
                    unproxy$2034.set(p$2093, val$2089);
                    return p$2093;
                }
            }.bind(this);
        });
    }
    function check$2043(predicate$2110, name$2111) {
        var c$2112 = new Contract$2039(name$2111, 'check', function (blame$2113) {
            return function (val$2114) {
                if (predicate$2110(val$2114)) {
                    return val$2114;
                } else {
                    raiseBlame$2041(blame$2113.addExpected(name$2111).addGiven(val$2114));
                }
            };
        });
        return c$2112;
    }
    function addTh$2044(a0$2115) {
        if (a0$2115 === 0) {
            return '0th';
        }
        if (a0$2115 === 1) {
            return '1st';
        }
        if (a0$2115 === 2) {
            return '2nd';
        }
        if (a0$2115 === 3) {
            return '3rd';
        }
        var x$2116 = a0$2115;
        return x$2116 + 'th';
    }
    function pluralize$2045(a0$2117, a1$2118) {
        if (a0$2117 === 0) {
            var str$2120 = a1$2118;
            return str$2120 + 's';
        }
        if (a0$2117 === 1) {
            var str$2120 = a1$2118;
            return str$2120;
        }
        var n$2119 = a0$2117;
        var str$2120 = a1$2118;
        return str$2120 + 's';
    }
    function toContract$2046(f$2121) {
        return check$2043(f$2121, function () {
            if (f$2121.name) {
                return f$2121.name;
            } else {
                return 'custom contract';
            }
        }.bind(this)());
    }
    function fun$2047(domRaw$2122, rngRaw$2123, options$2124) {
        var dom$2125 = domRaw$2122.map(function (d$2133) {
            if (!(d$2133 instanceof Contract$2039)) {
                if (typeof d$2133 === 'function') {
                    return toContract$2046(d$2133);
                }
                throw new Error(d$2133 + ' is not a contract');
            }
            return d$2133;
        });
        var domStr$2126 = dom$2125.map(function (d$2134, idx$2135) {
            return options$2124 && options$2124.namesStr ? options$2124.namesStr[idx$2135] + ': ' + d$2134 : d$2134;
        }).join(', ');
        var domName$2127 = '(' + domStr$2126 + ')';
        var rng$2128 = rngRaw$2123;
        if (!(rngRaw$2123 instanceof Contract$2039)) {
            if (typeof rngRaw$2123 === 'function') {
                rng$2128 = toContract$2046(rngRaw$2123);
            } else {
                throw new Error(rng$2128 + ' is not a contract');
            }
        }
        var rngStr$2129 = options$2124 && options$2124.namesStr ? options$2124.namesStr[options$2124.namesStr.length - 1] + ': ' + rng$2128 : rng$2128;
        var thisName$2130 = options$2124 && options$2124.thisContract ? '\n    | this: ' + options$2124.thisContract : '';
        var contractName$2131 = domName$2127 + ' -> ' + rngStr$2129 + thisName$2130 + (options$2124 && options$2124.dependencyStr ? ' | ' + options$2124.dependencyStr : '');
        var c$2132 = new Contract$2039(contractName$2131, 'fun', function (blame$2136, unwrapTypeVar$2137, projOptions$2138) {
            return function (f$2139) {
                blame$2136 = blame$2136.addParents(contractName$2131);
                if (typeof f$2139 !== 'function') {
                    raiseBlame$2041(blame$2136.addExpected('a function that takes ' + dom$2125.length + pluralize$2045(dom$2125.length, ' argument')).addGiven(f$2139));
                }
                function applyTrap$2140(target$2141, thisVal$2142, args$2143) {
                    var checkedArgs$2144 = [];
                    var depArgs$2145 = [];
                    for (var i$2146 = 0; i$2146 < dom$2125.length; i$2146++) {
                        if (dom$2125[i$2146].type === 'optional' && args$2143[i$2146] === undefined) {
                            continue;
                        } else {
                            var location$2152 = 'the ' + addTh$2044(i$2146 + 1) + ' argument of';
                            var unwrapForProj$2153 = dom$2125[i$2146].type === 'fun' ? !unwrapTypeVar$2137 : unwrapTypeVar$2137;
                            var domProj$2154 = dom$2125[i$2146].proj(blame$2136.swap().addLocation(location$2152), unwrapForProj$2153);
                            checkedArgs$2144.push(domProj$2154(args$2143[i$2146]));
                            if (options$2124 && options$2124.dependency) {
                                var depProj$2155 = dom$2125[i$2146].proj(blame$2136.swap().setNeg('the contract of ' + blame$2136.name).addLocation(location$2152));
                                depArgs$2145.push(depProj$2155(args$2143[i$2146]));
                            }
                        }
                    }
                    checkedArgs$2144 = checkedArgs$2144.concat(args$2143.slice(i$2146));
                    var checkedThis$2147 = thisVal$2142;
                    if (options$2124 && options$2124.thisContract || projOptions$2138 && projOptions$2138.overrideThisContract) {
                        var thisContract$2156 = function () {
                            if (projOptions$2138 && projOptions$2138.overrideThisContract) {
                                return projOptions$2138.overrideThisContract;
                            } else {
                                return options$2124.thisContract;
                            }
                        }.bind(this)();
                        var thisProj$2157 = thisContract$2156.proj(blame$2136.swap().addLocation('the this value of'));
                        checkedThis$2147 = thisProj$2157(thisVal$2142);
                    }
                    assert$2038(rng$2128 instanceof Contract$2039, 'The range is not a contract');
                    var rawResult$2148 = target$2141.apply(checkedThis$2147, checkedArgs$2144);
                    var rngUnwrap$2149 = rng$2128.type === 'fun' ? unwrapTypeVar$2137 : !unwrapTypeVar$2137;
                    var rngProj$2150 = rng$2128.proj(blame$2136.addLocation('the return of'), rngUnwrap$2149);
                    var rngResult$2151 = rngProj$2150(rawResult$2148);
                    if (options$2124 && options$2124.dependency && typeof options$2124.dependency === 'function') {
                        var depResult$2158 = options$2124.dependency.apply(this, depArgs$2145.concat(rngResult$2151));
                        if (!depResult$2158) {
                            raiseBlame$2041(blame$2136.addExpected(options$2124.dependencyStr).addGiven(false).addLocation('the return dependency of'));
                        }
                    }
                    return rngResult$2151;
                }
                if (// only use expensive proxies when needed (to distinguish between apply and construct)
                    options$2124 && options$2124.needs_proxy) {
                    var p$2159 = new Proxy(f$2139, {
                        apply: function (target$2160, thisVal$2161, args$2162) {
                            return applyTrap$2140(target$2160, thisVal$2161, args$2162);
                        }
                    });
                    return p$2159;
                } else {
                    return function () {
                        return applyTrap$2140(f$2139, this, Array.prototype.slice.call(arguments));
                    };
                }
            };
        });
        return c$2132;
    }
    function optional$2048(contract$2163, options$2164) {
        if (!(contract$2163 instanceof Contract$2039)) {
            if (typeof contract$2163 === 'function') {
                contract$2163 = toContract$2046(contract$2163);
            } else {
                throw new Error(contract$2163 + ' is not a contract');
            }
        }
        var contractName$2165 = '?' + contract$2163;
        return new Contract$2039(contractName$2165, 'optional', function (blame$2166, unwrapTypeVar$2167) {
            return function (val$2168) {
                var proj$2169 = contract$2163.proj(blame$2166, unwrapTypeVar$2167);
                return proj$2169(val$2168);
            };
        });
    }
    function repeat$2049(contract$2170, options$2171) {
        if (!(contract$2170 instanceof Contract$2039)) {
            if (typeof contract$2170 === 'function') {
                contract$2170 = toContract$2046(contract$2170);
            } else {
                throw new Error(contract$2170 + ' is not a contract');
            }
        }
        var contractName$2172 = '....' + contract$2170;
        return new Contract$2039(contractName$2172, 'repeat', function (blame$2173, unwrapTypeVar$2174) {
            return function (val$2175) {
                var proj$2176 = contract$2170.proj(blame$2173, unwrapTypeVar$2174);
                return proj$2176(val$2175);
            };
        });
    }
    function array$2050(arrContractRaw$2177, options$2178) {
        var proxyPrefix$2179 = options$2178 && options$2178.proxy ? '!' : '';
        var arrContract$2180 = arrContractRaw$2177.map(function (c$2$2184) {
            if (!(c$2$2184 instanceof Contract$2039)) {
                if (typeof c$2$2184 === 'function') {
                    return toContract$2046(c$2$2184);
                }
                throw new Error(c$2$2184 + ' is not a contract');
            }
            return c$2$2184;
        });
        var contractName$2181 = proxyPrefix$2179 + '[' + arrContract$2180.map(function (c$2$2185) {
            return c$2$2185;
        }).join(', ') + ']';
        var contractNum$2182 = arrContract$2180.length;
        var c$2183 = new Contract$2039(contractName$2181, 'array', function (blame$2186, unwrapTypeVar$2187) {
            return function (arr$2188) {
                if (typeof arr$2188 === 'number' || typeof arr$2188 === 'string' || typeof arr$2188 === 'boolean' || arr$2188 == null) {
                    raiseBlame$2041(blame$2186.addGiven(arr$2188).addExpected('an array with at least ' + contractNum$2182 + pluralize$2045(contractNum$2182, ' field')));
                }
                for (var ctxIdx$2189 = 0, arrIdx$2190 = 0; ctxIdx$2189 < arrContract$2180.length; ctxIdx$2189++) {
                    if (arrContract$2180[ctxIdx$2189].type === 'repeat' && arr$2188.length <= ctxIdx$2189) {
                        break;
                    }
                    var unwrapForProj$2191 = arrContract$2180[ctxIdx$2189].type === 'fun' ? !unwrapTypeVar$2187 : unwrapTypeVar$2187;
                    var fieldProj$2192 = arrContract$2180[ctxIdx$2189].proj(blame$2186.addLocation('the ' + addTh$2044(arrIdx$2190) + ' field of'), unwrapForProj$2191);
                    var checkedField$2193 = fieldProj$2192(arr$2188[arrIdx$2190]);
                    arr$2188[arrIdx$2190] = checkedField$2193;
                    arrIdx$2190++;
                    if (arrContract$2180[ctxIdx$2189].type === 'repeat') {
                        if (ctxIdx$2189 !== arrContract$2180.length - 1) {
                            throw new Error('The repeated contract must come last in ' + contractName$2181);
                        }
                        for (; arrIdx$2190 < arr$2188.length; arrIdx$2190++) {
                            var repeatProj$2194 = arrContract$2180[ctxIdx$2189].proj(blame$2186.addLocation('the ' + addTh$2044(arrIdx$2190) + ' field of'), unwrapForProj$2191);
                            arr$2188[arrIdx$2190] = repeatProj$2194(arr$2188[arrIdx$2190]);
                        }
                    }
                }
                if (options$2178 && options$2178.proxy) {
                    return new Proxy(arr$2188, {
                        set: function (target$2195, key$2196, value$2197) {
                            var lastContract$2198 = arrContract$2180[arrContract$2180.length - 1];
                            var fieldProj$2$2199;
                            if (arrContract$2180[key$2196] !== undefined && arrContract$2180[key$2196].type !== 'repeat') {
                                fieldProj$2$2199 = arrContract$2180[key$2196].proj(blame$2186.swap().addLocation('the ' + addTh$2044(key$2196) + ' field of'));
                                target$2195[key$2196] = fieldProj$2$2199(value$2197);
                            } else if (lastContract$2198 && lastContract$2198.type === 'repeat') {
                                fieldProj$2$2199 = lastContract$2198.proj(blame$2186.swap().addLocation('the ' + addTh$2044(key$2196) + ' field of'));
                                target$2195[key$2196] = fieldProj$2$2199(value$2197);
                            }
                        }
                    });
                } else {
                    return arr$2188;
                }
            };
        });
        return c$2183;
    }
    function object$2051(objContract$2200, options$2201) {
        var contractKeys$2202 = Object.keys(objContract$2200);
        contractKeys$2202.forEach(function (prop$2207) {
            if (!(objContract$2200[prop$2207] instanceof Contract$2039)) {
                if (typeof objContract$2200[prop$2207] === 'function') {
                    objContract$2200[prop$2207] = toContract$2046(objContract$2200[prop$2207]);
                } else {
                    throw new Error(objContract$2200[prop$2207] + ' is not a contract');
                }
            }
        });
        var proxyPrefix$2203 = options$2201 && options$2201.proxy ? '!' : '';
        var contractName$2204 = proxyPrefix$2203 + '{' + contractKeys$2202.map(function (prop$2208) {
            return prop$2208 + ': ' + objContract$2200[prop$2208];
        }).join(', ') + '}';
        var keyNum$2205 = contractKeys$2202.length;
        var c$2206 = new Contract$2039(contractName$2204, 'object', function (blame$2209) {
            return function (obj$2210) {
                if (typeof obj$2210 === 'number' || typeof obj$2210 === 'string' || typeof obj$2210 === 'boolean' || obj$2210 == null) {
                    raiseBlame$2041(blame$2209.addGiven(obj$2210).addExpected('an object with at least ' + keyNum$2205 + pluralize$2045(keyNum$2205, ' key')));
                }
                contractKeys$2202.forEach(function (key$2211) {
                    if (!(objContract$2200[key$2211].type === 'optional' && obj$2210[key$2211] === undefined)) {
                        var propProjOptions$2212 = function () {
                            if (objContract$2200[key$2211].type === 'fun') {
                                return { overrideThisContract: this };
                            } else {
                                return {};
                            }
                        }.bind(this)();
                        var c$2$2213 = function () {
                            if (objContract$2200[key$2211].type === 'cycle') {
                                return objContract$2200[key$2211].cycleContract;
                            } else {
                                return objContract$2200[key$2211];
                            }
                        }.bind(this)();
                        var propProj$2214 = c$2$2213.proj(blame$2209.addLocation('the ' + key$2211 + ' property of'), false, propProjOptions$2212);
                        var checkedProperty$2215 = propProj$2214(obj$2210[key$2211]);
                        obj$2210[key$2211] = checkedProperty$2215;
                    }
                }.bind(this));
                if (options$2201 && options$2201.proxy) {
                    return new Proxy(obj$2210, {
                        set: function (target$2216, key$2217, value$2218) {
                            if (objContract$2200.hasOwnProperty(key$2217)) {
                                var c$2$2219 = function () {
                                    if (objContract$2200[key$2217].type === 'cycle') {
                                        return objContract$2200[key$2217].cycleContract;
                                    } else {
                                        return objContract$2200[key$2217];
                                    }
                                }.bind(this)();
                                var propProj$2220 = c$2$2219.proj(blame$2209.swap().addLocation('setting the ' + key$2217 + ' property of'));
                                var checkedProperty$2221 = propProj$2220(value$2218);
                                target$2216[key$2217] = checkedProperty$2221;
                            } else {
                                target$2216[key$2217] = value$2218;
                            }
                        }
                    });
                } else {
                    return obj$2210;
                }
            }.bind(this);
        });
        return c$2206;
    }
    function reMatch$2052(re$2222) {
        var contractName$2223 = re$2222.toString();
        return check$2043(function (val$2224) {
            return re$2222.test(val$2224);
        }, contractName$2223);
    }
    function and$2053(left$2225, right$2226) {
        if (!(left$2225 instanceof Contract$2039)) {
            if (typeof left$2225 === 'function') {
                left$2225 = toContract$2046(left$2225);
            } else {
                throw new Error(left$2225 + ' is not a contract');
            }
        }
        if (!(right$2226 instanceof Contract$2039)) {
            if (typeof right$2226 === 'function') {
                right$2226 = toContract$2046(right$2226);
            } else {
                throw new Error(right$2226 + ' is not a contract');
            }
        }
        var contractName$2227 = left$2225 + ' and ' + right$2226;
        return new Contract$2039(contractName$2227, 'and', function (blame$2228) {
            return function (val$2229) {
                var leftProj$2230 = left$2225.proj(blame$2228.addExpected(contractName$2227, true));
                var leftResult$2231 = leftProj$2230(val$2229);
                var rightProj$2232 = right$2226.proj(blame$2228.addExpected(contractName$2227, true));
                return rightProj$2232(leftResult$2231);
            };
        });
    }
    function or$2054(left$2233, right$2234) {
        if (!(left$2233 instanceof Contract$2039)) {
            if (typeof left$2233 === 'function') {
                left$2233 = toContract$2046(left$2233);
            } else {
                throw new Error(left$2233 + ' is not a contract');
            }
        }
        if (!(right$2234 instanceof Contract$2039)) {
            if (typeof right$2234 === 'function') {
                right$2234 = toContract$2046(right$2234);
            } else {
                throw new Error(right$2234 + ' is not a contract');
            }
        }
        var contractName$2235 = left$2233 + ' or ' + right$2234;
        return new Contract$2039(contractName$2235, 'or', function (blame$2236) {
            return function (val$2237) {
                try {
                    var leftProj$2238 = left$2233.proj(blame$2236.addExpected(contractName$2235, true));
                    return leftProj$2238(val$2237);
                } catch (b$2239) {
                    var rightProj$2240 = right$2234.proj(blame$2236.addExpected(contractName$2235, true));
                    return rightProj$2240(val$2237);
                }
            };
        });
    }
    function cyclic$2055(name$2241) {
        return new Contract$2039(name$2241, 'cycle', function () {
            throw new Error('Stub, should never be called');
        });
    }
    function guard$2056(contract$2242, value$2243, name$2244) {
        var proj$2245 = contract$2242.proj(Blame$2036.create(name$2244, 'function ' + name$2244, '(calling context for ' + name$2244 + ')'));
        return proj$2245(value$2243);
    }
    return {
        Num: check$2043(function (val$2246) {
            return typeof val$2246 === 'number';
        }, 'Num'),
        Str: check$2043(function (val$2247) {
            return typeof val$2247 === 'string';
        }, 'Str'),
        Bool: check$2043(function (val$2248) {
            return typeof val$2248 === 'boolean';
        }, 'Bool'),
        Odd: check$2043(function (val$2249) {
            return val$2249 % 2 === 1;
        }, 'Odd'),
        Even: check$2043(function (val$2250) {
            return val$2250 % 2 !== 1;
        }, 'Even'),
        Pos: check$2043(function (val$2251) {
            return val$2251 >= 0;
        }, 'Pos'),
        Nat: check$2043(function (val$2252) {
            return val$2252 > 0;
        }, 'Nat'),
        Neg: check$2043(function (val$2253) {
            return val$2253 < 0;
        }, 'Neg'),
        Any: check$2043(function (val$2254) {
            return true;
        }, 'Any'),
        None: check$2043(function (val$2255) {
            return false;
        }, 'None'),
        Null: check$2043(function (val$2256) {
            return null === val$2256;
        }, 'Null'),
        Undefined: check$2043(function (val$2257) {
            return void 0 === val$2257;
        }, 'Null'),
        Void: check$2043(function (val$2258) {
            return null == val$2258;
        }, 'Null'),
        check: check$2043,
        reMatch: reMatch$2052,
        fun: fun$2047,
        or: or$2054,
        and: and$2053,
        repeat: repeat$2049,
        optional: optional$2048,
        object: object$2051,
        array: array$2050,
        cyclic: cyclic$2055,
        Blame: Blame$2036,
        makeCoffer: makeCoffer$2042,
        guard: guard$2056
    };
}();
;
var inner_plus1$2032 = _c$606.fun([typeof Num !== 'undefined' ? Num : _c$606.Num], typeof Num !== 'undefined' ? Num : _c$606.Num).proj(_c$606.Blame.create('plus1', 'function plus1', '(calling context for plus1)', 4))(function plus1$2033(x$2259) {
    return function (_1$2261) {
        return _1$2261 + 1;
    }(x$2259);
});
function plus1$2033(x$2262) {
    return inner_plus1$2032.apply(this, arguments);
}
console.log(plus1$2033('hi'));
//# sourceMappingURL=index.js.map
