(function(root,factory){'use strict';if(typeof define==='function'&&define.amd){define([],function(){return(root.holmes=factory(document));});}else if(typeof exports==='object'){module.exports=factory(document);}else{root.holmes=factory(document);}})(this,function(document){'use strict';function holmes(options){if(typeof options!='object'){throw new Error('The options need to be given inside an object like this:\nholmes({\n\tfind:".result",\n\tdynamic:false\n});\n see also https://haroen.me/holmes/doc/module-holmes.html');}
if(typeof options.find=='undefined'){throw new Error('A find argument is needed. That should be a querySelectorAll for each of the items you want to match individually. You should have something like: \nholmes({\n\tfind:".result"\n});\nsee also https://haroen.me/holmes/doc/module-holmes.html');}
if(typeof options.instant=='undefined'){options.instant=false;}
if(options.instant){start();}else{window.addEventListener('DOMContentLoaded',start);}
function start(){if(typeof options.input=='undefined'){options.input='input[type=search]';}
if(typeof options.placeholder=='undefined'){options.placeholder=false;}
if(typeof options.class=='undefined'){options.class={};}
if(typeof options.class.visible=='undefined'){options.class.visible=false;}
if(typeof options.class.hidden=='undefined'){options.class.hidden='hidden';}
if(typeof options.dynamic=='undefined'){options.dynamic=false;}
if(typeof options.contenteditable=='undefined'){options.contenteditable=false;}
var search=document.querySelector(options.input);var elements=document.querySelectorAll(options.find);var elementsLength=elements.length;if(options.placeholder){var placeholder=document.createElement('div');placeholder.classList.add(options.class.hidden);placeholder.innerHTML=options.placeholder;elements[0].parentNode.appendChild(placeholder);}
if(options.class.visible){var i;for(i=0;i<elementsLength;i++){elements[i].classList.add(options.class.visible);}}
search.addEventListener('input',function(){var found=false;var searchString;if(options.contenteditable){searchString=search.textContent.toLowerCase();}else{searchString=search.value.toLowerCase();}
if(options.dynamic){elements=document.querySelectorAll(options.find);elementsLength=elements.length;}
var i;for(i=0;i<elementsLength;i++){if(elements[i].textContent.toLowerCase().indexOf(searchString)===-1){elements[i].classList.add(options.class.hidden);if(options.class.visible){elements[i].classList.remove(options.class.visible);}}else{elements[i].classList.remove(options.class.hidden);if(options.class.visible){elements[i].classList.add(options.class.visible);}
found=true;}};if(!found&&options.placeholder){placeholder.classList.remove(options.class.hidden);}else{placeholder.classList.add(options.class.hidden);}});};};return holmes;});