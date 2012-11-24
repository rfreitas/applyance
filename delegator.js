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


(function(window, undefined){

	var out =
	window.applyance = {};

	out.forEachApply = function( delegateFuncs, args, target){
		delegateFuncs.forEach(function(func,index){
			func.apply( target, arguments );
		});
	};


	out.createDelegator = function(wrappedFunction){
		var delegator = function(){
			var meta = delegator.delegatorMeta;

			out.forEachApply( meta.delegatesBefore , arguments );
			var result = typeof meta.wrappedFunction === "function" ? meta.wrappedFunction.apply(this, arguments) : undefined;
			out.forEachApply( meta.delegates , arguments );

			return result;
		};

		var 	delegatorMeta =
		delegator.delegatorMeta = {};

		delegatorMeta.delegates = [];
		delegatorMeta.delegatesBefore = [];
		delegatorMeta.wrappedFunction = wrappedFunction;

		return delegator;
	};


	out.setUp = function( delegatorObject, function_key, force){
		var existingFunc = delegatorObject[function_key];

		if (  out.isDelegator( existingFunc ) ){
			return existingFunc;
		}

		var newFunc = null;


		if ( force || typeof existingFunc === "function" || typeof existingFunc === "undefined" || existingFunc === null){
			newFunc = out.createDelegator();
		}
		else{
		//error
		return;
	}


	if (typeof existingFunc === "function"){
		newFunc.delegatorMeta.wrappedFunction = function(){
			existingFunc.apply(delegatorObject, arguments);
		};
	}
	
	/* the user chooses what to do
	if ( Object.freeze ){
		Object.freeze(delegatorMeta);
		Object.freeze(newFunc);
	}
	*/

	delegatorObject[function_key] = newFunc;

	return newFunc;
};


out.tearDown = function( delegator, function_key ){
	var func = delegator[function_key];
	if ( out.isDelegator(func) ){
		var existingFunc = func.delegatorMeta.wrappedFunction;
		if(existingFunc){
			delegator[function_key] = existingFunc;
		}
		return true;
	}
	return false;
};

out.isDelegator = function(func){
	return typeof func === "function" && typeof func.delegatorMeta === "object";
};

//before and target are both optional
out.delegate = function( delegator, function_key, handler, before, target  ){
	//handler prep
	if (target){
		handler = function(){
			return handler.apply(target,arguments);
		};
	}
	
	var funcToDelegate = out.setUp( delegator, function_key );

	if ( typeof funcToDelegate !== "function"){
		console.log("Function to delegate from is not really a function but a "+typeof funcToDelegate);
		return false;
	}

	var delegatesArray = before ? funcToDelegate.delegatorMeta.delegatesBefore : funcToDelegate.delegatorMeta.delegates;

	delegatesArray.push( handler );
	return funcToDelegate;
};

})(window, undefined);