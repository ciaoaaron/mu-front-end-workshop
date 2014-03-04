function Utility(){}

Utility.prototype.loadArticleTitle = function( parentElement, title ){
	parentElement.find('h1').html( title );
}
Utility.prototype.loadArticleContent = function( parentElement, content ){
	parentElement.find('.text-content').find('p').remove();
	parentElement.find('h1').after( content );
}
Utility.prototype.loadArticleDate = function( parentElement, dateObject ){
	//caching the dateBadge element for easy access in the future.
	var dateBadge = parentElement.find('.date-badge');
	//adding the content to the different date sections.
	dateBadge.find('.month').html( dateObject.month )
	dateBadge.find('.date').html( dateObject.date )
	dateBadge.find('.year').html( dateObject.year );
};
Utility.prototype.loadArticlesImages = function( parentElement, articleType, imageTitle, imagePath ){
	var imageContainer;
	if( articleType === 'featured'){
		imageContainer = parentElement.find(".hero-image");
	}
	else if( articleType === 'trending'){
		imageContainer = parentElement;
	}
	imageContainer.html('<img src="'+imagePath+'" alt="'+imageTitle+'"/>');
}
Utility.prototype.loadArticles = function( obj ){
	var parent = obj.parentElement,
		self = Utility.prototype;

	self.loadArticlesImages( parent, obj.type, obj.title, obj.imagePath, obj.articleIndex );

	if( obj.type === 'featured' ){
		self.loadArticleTitle( parent, obj.title );
		self.loadArticleContent( parent, obj.content );
		self.loadArticleDate( parent, obj.date );
		self.loadArticlesImages( parent, obj.type, obj.title, obj.imagePath );
	}
}
Utility.prototype.resultToArray = function( articles ){
	var item,
		result = [];
	//running a for...in loop to collect all valid articles into an array 
	for( item in articles ){
		//check if the item actually belongs to articles
		if( articles.hasOwnProperty(item) ){
			result.push( articles[ item ] );
		}
	}
	return result;
}
Utility.prototype.parseItemAsFeatued = function( item ){
	var curArticle = $('.featured-content'),
		self = Utility.prototype;
	self.loadArticles({
		parentElement: curArticle,
		type: 'featured',
		title: item.title,
		content: item.content,
		date: item.date,
		imagePath: item.hero_image
	});
	return  curArticle;
}
Utility.prototype.parseItemAsTrending = function( item, index ){
	var curArticle = $('.trending-content').find(".article").eq( index - 1 ),
		self = Utility.prototype;
	self.loadArticles({
		parentElement: curArticle,
		type: 'trending',
		title: item.title,
		imagePath: item.thumb_image
	});
	return curArticle;
}
Utility.prototype.parseArticle = function( data ){
	var articles = data.articles,
		item,
		articlesArray = [],
		currentArticle,
		self = Utility.prototype;
	
	articlesArray = self.resultToArray( data.articles );
	//processing the array collected from the for...in loop
	articlesArray.forEach(function(	item, index ){
		//if it is the first article, we pus it into the main hero area
		if( index === 0 ) {
			currentArticle = self.parseItemAsFeatued( item );
		} else {
			currentArticle = self.parseItemAsTrending( item, index );
		}
		//add an data attribute to rememebr which article the article container is currently holding.
		currentArticle.data('cur-article', index);
	});
	return articlesArray;
}