(function( $ ){

	//instantiating the utility library. ignore these two lines for now if you are confused.
	var utility = new Utility,
		collectedArticles;


	/*
	 * At the very basic level, there are 2 ways to organize your functions
	 *
	 * Method 1: Defining functions as Functions 
	 *
	 * Pop Quiz:
	 * What is an invocation?
	 * How do you invoke a function that is defined as a function?
	 * And what is the name of this invocation?
	 *
	 */	

	/*
	 * @func loadArticles: loads all the articles from a JSON source.
	 * @param string dataPath: the path to the data source. 
	 */	
	function loadData( dataPath, callback ){
		//using ajax() from jQuery – aka $.ajax. The dollar sign signifies a jQuery instance/object.
		$.ajax({
			url: dataPath,
			type: 'GET',
			dataType: 'json',
			cache: false,
			success: callback
		});
	}
	/*
	 * The following function are callback functions used with @func loadData. A callback function is a function that is invoked inside a function. A callback is usually invoked when the origial function is finished doing its job, it is invoked as the last step of the original function.

	 For example, if we use loadData as such: loadData("[my path to data]", loadArticleOnSuccess);, the loadArticleOnSuccess will replace "callback" in the member "success" and become the function to be invoked when the $.ajax() is finished getting data from the path.
	 *
	 */	
	 //data is included as parameter because we know that the success member from an $.ajax function will automatically give us the data it found from the source path.
	function loadArticlesOnSuccess( data ){

		//cache the received data into a local variable called collectedArticles so that we dont not have to keep asking the "server" and using http request; let the utility to parse the articles for us, after the parsing is done, the function will return the articles in an array.
		collectedArticles = utility.parseArticle( data );

	}
	/*
	 * @func loadAnArticle: load only one article based on given parameters. 
	 * @param number index: the index of the article to be loaded. This index value aligns with what is specified in the JSON.
	 * @param string type: the type of article to laod as.
	 	possible values: trending, featured
	 * @param number trendingIndex: optional, only needed when loading an article as a trending article. This index specifies which trending article image the new article should replace. This index is based on the index of the trending article elements in the DOM.
	 */	
	function loadAnArticle( index, type, trendingIndex ){
		var curArticle; 

		if( type === 'featured'){
			curArticle = utility.parseItemAsFeatued( collectedArticles[ index ] );
		}
		else if( type === 'trending'){
			curArticle = utility.parseItemAsTrending( collectedArticles[ index ], trendingIndex );
		}
		curArticle.data('cur-article', index );
	}

	/*
	 *
	 * Method 2: Defining as Object Literals 
	 *
	 * Pop Quiz:  
	 * 1. Can an object literal store other data types?
	 * 2. What are some of the Javascript data types?
	 * 3. Does JS really have data types?
	 * 4. How do you invoke a function stored in anobject literal?
	 * 5. And what kind of invocation is that called?
	 *
	 */	
	var userActions = {
		/*
		 * @func launchMenu: opens the mutants menu 
		 * @param object event: This is not a param that we pass in manually. The event object will be passed in to this function as a parameter when used with .on() to set up an event.
		 */	
		launchMenu: function( event ){
			var theNav = $(event.target).parents('nav');
			if( theNav.hasClass('active') ){
				theNav.removeClass('active');
			} else {
				theNav.addClass('active');
			}
			return false;
		},
		/*
		 * @func swapContent: swapping the content with the featured content when a trending article is clicked. 
		 *
		 */	
		swapContent: function( event ){
			//if the user click on the image in the .article element, chances are that event.target will be the image, and not the .article element iteself. In which case, we will process "target" at a later point so that we can make sure we are getting .article, and not the image inside it.
			var target = $(event.target),
				currentMainContent = $('.featured-content').data('cur-article'),
				//we are defining triggeredArticle by using an anonymous function.
				clickedIndex = target.index(),
				triggeredArticle = (function(){
					//if the current clicked element does not have any cur-article data, we move up in the DOM to the find the parent that has the class .article, because we know we stored a cur-article data there when we load in the article from the library.
					if( !target.data('cur-article') ){
						//change target back to the .article element
						target = target.parents('.article');
						//also update the index so that it is the index for the .article element, no longer for the image.
						clickedIndex = target.index();
						//the following returns a value back to triggeredArticle. Remember, we are currently in an anonymous funciton that is helping to define triggeredArticle.
						return target.data('cur-article');
					}
				}());
			//using the laodAnArticle function defined before.
			loadAnArticle( triggeredArticle, 'featured' );
			//clickedIndex needs to substract 1 because the index in the article JSON object is not aligned with the index of the  .article elements. Note that the first index in an Array is 0. When $ returns a list of elements, it is stored in an array.
			loadAnArticle( currentMainContent, 'trending', (clickedIndex - 1) );

			return false;
		}
	}

	//Event binding
	/*
	 * Pop Quiz:
	 * 1. Can you name other events?
	 * 2. Other than ways like .click(), what other jQuery methods can you use to bind events? (hint: x2 )
	 * 3. What are the differences between the 3 ways of binding events?
	 *
	 */	
	$(document)
		//remember the event parameter, it in here when the "event" is passed into userActions.launchMenu
		.on('click', '.site-menu-click-area', userActions.launchMenu )
		//same here
		.on('click', '.trending-content .article', userActions.swapContent );

	//initialize the page by loading in the articles from our JSON source.
	loadData('data-fixtures/articles.json', loadArticlesOnSuccess);

	/*
	 * Pop Quiz:
	 * 1. What is a namespace.
	 * 2. Name some of the differences between classical languages and JS.
	 * 3. What is an anonymous function?
	 * 4. What is scope?
	 * 5. What is closure?
	 *
	 */	

}( jQuery ));