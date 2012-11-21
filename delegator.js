/*
delegator

brand:
	applyance

delegate function calls with ease

TODO
make it less abstract so that the user knows what he is doing
eg
obj.func = delegator( obj.func or key, obj )
obj.func.delegates.push( function(){} )
obj.func.delegatesBefore.push( function(){} )

references:
http://stackoverflow.com/questions/7991607/best-publish-subscribe-library-in-javascript
*/

var findDelegates = function(delegator, function_key, before){
	//TODO
};

var delegate = function( delegator, function_key, args, before ){
	var delegateFuncs = findDelegates(delegator, function_key, before);
	delegateFuncs.forEach(function(func,index){
		func.apply( window, args );
	});
};

var forEachApply = function( delegateFuncs, args){
	delegateFuncs.orEach(function(func,index){
		func.apply( window, arguments );
	});
};


var pubDelegation = function( delegator, function_key){
	var existingFunc = delegator[function_key];
	var newFunc = null;

	var delegateFuncsBefore = [];
	var delegateFuncs = [];

	
	if ( typeof existingFunc === "function" ){
		newFunc = function(){
			forEachApply( delegateFuncsBefore, arguments );
			var out = existingFunc.apply(delegator, arguments);
			forEachApply( delegateFuncs, arguments );
			return out;
		};
	}
	else if( typeof existingFunc === "undefined" ) {
		newFunc = function(){
			forEachApply( delegateFuncsBefore, arguments );
			forEachApply( delegateFuncs, arguments );
		};
	}
	else{
		//error
		return;
	}

	newFunc._delegateFuncsBefore = delegateFuncsBefore;
	newFunc._delegateFuncs = delegateFuncs;
	newFunc._existingFunc = existingFunc;

	delegator[function_key] = newFunc;
};

var restoreFunction = function( delegator, function_key){
	var existingFunc = delegator[function_key]._existingFunc;
	if(existingFunc){
		delegator[function_key] = existingFunc;
	}
};

var deleteDelegation = function(){
	//
};

var subDelegation = function( delegator, function_key, handler, target, before ){
	if (target){
		handler = function(){
			return handler.apply(target,arguments);
		};
	}
	//TODO
};