/*!
 * imgPicker v1.0.0
 * https://github.com/zeeeuu/imgPicker
 * Copyright Krishna Kashyap
 * Released under the MIT license
 * Date: 2018-12-22T22:42Z
 */

window = ( typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {} );
document = window.document || {};

; ( function ( factory, global ) {
    if ( typeof require === "function" && typeof exports === "object" && typeof module === "object" ) {

        // CommonJS
        factory( require( "jquery" ) );
    } else if ( typeof define === "function" && define.amd ) {

        // AMD
        define( [ "jquery" ], factory );
    } else {

        // Normal script tag
        factory( global.jQuery );
    }
}(function($){
    "use strict"
     
  let imgPicker={

       initiate:false,
       image:{

           original:{
             name:null,
             dataURL:null,
             from:null,
             src:null,
             size:null,
             width:null,
             height:null
           },
           resized:{
             src:null,
             size:null,
             width:null,
             height:null
           },
           edited:{
             src:null,
             size:null,
             width:null,
             height:null
           }

         },
     
    init(options){
      
          this.$image_modal=$('<div class="image-modal"></div>');
          $('body').append(this.$image_modal);
          $(this.$image_modal).load('src/html/imgPicker.html',
          function(){
              
              imgPicker.$preset=imgPicker.$image_modal.find('.preset');
              
              imgPicker.cacheDom();
              imgPicker.bindEvent();  

                if (options!==null) {

      let new_settings=$.extend({},imgPicker.settings,options);
          imgPicker.updateSettings(new_settings);
          imgPicker.updateModal();
 
    }
   }
   );
          
    },
   cacheDom(){
         imgPicker.$ok_button=$('.image-modal .ok-button');
         this.$cancel_button=$('.image-modal .cancel-button');
         this.$modal_close=$('.image-modal .modal-close');
         this.$modal_panel=$('.image-modal .modal-panel');
         this.$modal_divider=$('.image-modal .modal-divider');
         this.$modal_options=$('.image-modal .options');
         this.$close_panel=$('.image-modal .close-panel');
         this.$panel_actions=$('.image-modal .panel-actions');
         this.$choose_button=$('.image-modal .image-file');
         this.$search=$('.image-modal .from-search');
         this.$upload=$('.image-modal .by-upload');
         this.$from_web=$('.image-modal .from-web');
         this.$search_box=$('.image-modal .search-box');
         this.$search_action=$('.image-modal .search-demo');
         this.$search_modal=$('.image-modal .search-modal');
         this.$search_close=$('.image-modal .search-close');
         this.$create_image=$('.image-modal .create-image');
         this.$editing_image=$('.image-modal .editing-image');
         this.$image_panel=$('.image-modal .image-panel');
         this.$search_divider=$('.image-modal .search-divider');
         this.$search_input=$('.image-modal .image-search-input');
         this.$modal_body=$('.image-modal .modal-body');
         this.$modal_footer=$('.image-modal .modal-footer');
         this.loader_src='src/img/200wa.gif';
         this.$image_loader=$('.image-modal .image-loader');
         this.$image_tools=$('.image-modal .image-tool');
         this.$modal_container=$('.image-modal .modal-container');
         this.$rotate=$('.image-modal .rotate');
         this.$footer_buttons=$('.image-modal .footer-buttons');
         this.$flex_images=$('.image-modal .flex-images');
         this.$nosr=$('.image-modal .nosr');
         this.display_state='no';
         this.$web_input=$('.image-modal .web-input');
         this.search_display='no';
         this.action='add';
    },
    bindEvent(){
 
         this.$cancel_button.on('click',this.cancel);
         this.$ok_button.on('click',this.ok);
         this.$close_panel.on('click',function(){
           imgPicker.closePanel(this);
           
         });
         this.$panel_actions.on('click',function(){
          imgPicker.panelActions(this);
         });
         this.$flex_images.on('scroll',function(){
          let sh=this.scrollHeight,
              oh=this.offsetHeight;
               if(oh + this.scrollTop == sh)
            {
                // alert("End");
              
                let scroll_data=imgPicker.settings.search.onScroll();

            for(let image of scroll_data.images){
                
                 let imagediv=`<div class='item' data-w="${image.previewWidth}" data-h="100"><img data-type='search' data-src="${image.highRes}" src="${image.preview}" class="select-image"></div>`;
               imgPicker.$flex_images.append(imagediv);
              } 

             imgPicker.$flex_images.flexImages({rowHeight: 100});

            }
         });
         this.$modal_close.on('click',function(){
           
          imgPicker.close();
         });
         this.$search_action.on('click',function(){
            $(imgPicker.$search_modal).toggle();
            imgPicker.$search_input.focus();
            imgPicker.$modal_container.toggle();
             
         });
 
         this.$search_close.on('click',this.closeSearch);
         this.$choose_button.on('change',function(){
          imgPicker.validateImage(this,'upload');
          });

         this.$web_input.on('focusout',function(){
              
             imgPicker.validateImage(this,'fetch');
         });
    
     },
  
    settings:{
       
      preset:false,

      fromWeb:true,

      resize:false,

      upload:true,

      search:false,

      formate:['jpg','jpeg','png','gif'] ,

      containment:null
 
    } ,
 
      show(){
             imgPicker.$image_modal.toggle();
              
      },

      edit(src){

         imgPicker.action='edit';
            let image=new Image();
                image.src=src;
            imgPicker.$modal_panel.toggle();
            imgPicker.$create_image.toggle();
            imgPicker.displayImage(image);
            imgPicker.show();
      },
      editImage(el){
          let purpose=$(el).attr('data-for');
 
          switch (purpose)
          {
               case 'crop':

               $('.image-modal .crop-image').cropper('clear');
                
               break;

               case 'flip-x':
               $('.image-modal .crop-image').cropper('scale',-1,1);
                
               break;

               case 'flip-y':
               $('.image-modal .crop-image').cropper('scale',1,-1);
                
               break;

               case 'flip-xy':
                
               $('.image-modal .crop-image').cropper('scale',-1);
               break;

               case 'reset':
               $('.image-modal .crop-image').cropper('destroy');
                
               break;

          }
         },
     sourceSettings(el){
       
      $('.active-search-source').removeClass('active-search-source');
      $(el).addClass('active-search-source');
    },
    updateModal(){
 
        if(this.settings.preset!==false) 
         {
            for(let preset of this.settings.preset){
             
               if (preset instanceof Object && preset.hasOwnProperty('label')) {
                let images='';
                for(let url of preset.urlSet){
                 images+=`<img src="${url}" data-type="preset" data-src="${url}" class="preset-images select-image"></img>`;
                }

                 let pre=`<div data-display="no" class="options"><span data-for="preset" class=" static-panel-close">&times;</span><span class="modal-label">${preset.label}</span><div class="preset-content">${images}</div><div class="modal-divider">OR</div></div>`;
                 
                  imgPicker.$image_modal.find('.preset').append(pre);
                 $(pre).css('display','block');
 
               }    

            }
 
         }

         if(this.settings.search!==false) 
         {
           imgPicker.$search_input.autoComplete({
                minChars:(imgPicker.settings.search.minChars && !isNaN(imgPicker.settings.search.minChars)) || 0,
                source: function(term, suggest){
                   
                    let suggestions='';
                    if (imgPicker.settings.search.autoComplete(term) instanceof Array) {
                      suggestions=imgPicker.settings.search.autoComplete(term);
                    }
                    else{
                      suggestions=[];
                    }
                    suggest(suggestions);

                },
                renderItem: function (item, search){
                    
                 return '<div class="autocomplete-suggestion" data-langname="" data-lang="" data-val="'+item+'">'+item+'</div>';
      
                },
                onSelect: function(e, term, item){
                    
                let image_data= imgPicker.settings.search.data($(item).attr('data-val'));
                     
                if (image_data.total==0) {
                 imgPicker.$nosr.text('no result found');
                }

                else{
                  imgPicker.$nosr.text(image_data.total+' results');
                  imgPicker.$flex_images.html('');
                  for(let image of image_data.images){
                
                 let imagediv=`<div class='item' data-w="${image.previewWidth}" data-h="100"><img data-type='search' data-src="${image.highRes}" src="${image.preview}" class="select-image"></div>`;
               imgPicker.$flex_images.append(imagediv);
                  } 

                  imgPicker.$flex_images.flexImages({rowHeight: 100});
                }

                }
            });



           $('.image-modal .static-panel-close').click(function(){
                imgPicker.display_state='no';
                imgPicker.$modal_panel.toggle();
                $(this).toggle();
                $(imgPicker.$image_panel).toggle();
                $(imgPicker.$create_image).toggle();
                 
                $(imgPicker.$preset).find('.modal-divider').toggle();
                  $(imgPicker.$search_divider).css('display','block');

                if ($(this).attr('data-for')=='search') {
                  $(imgPicker.$preset).toggle();

                 }
                else{
                  $(imgPicker.$search).toggle();
 
                }

                imgPicker.resetImage();
 
           });

           $('.select-image').on('click',function(){
            imgPicker.$modal_panel.css('display','none');
            $(imgPicker.$image_panel).css('display','block');
                

               $(this).attr('data-type')=='search' ? (
               $(imgPicker.$preset).css('display','none'),
               $(imgPicker.$search_modal).toggle(),
               $(imgPicker.$search_divider).css('display','none'),
               $(imgPicker.$preset).find('.modal-divider').css('display','none'),
               $(imgPicker.$search).find('.static-panel-close').css('display','block'),
               imgPicker.$search_action.val(imgPicker.$search_input.val())
               ) 
               : ( 
                $(imgPicker.$search).css('display','none'),
                $(this).parent().parent().find('.modal-divider').css('display','none'),
                $(this).parent().parent().find('.static-panel-close').css('display','block')
                 );

                imgPicker.fillImage({
                src:$(this).attr('data-src'),
                name:null,
                size:null
               });
                

         });

          $(this.$search).toggle();
         }
         if(this.settings.fromWeb===false) 
         {  
          $(this.$search).find('.modal-divider').toggle();
          $(this.$from_web).toggle(); 
         }
         if(this.settings.upload===false) 
         {
          $(this.$upload).toggle();
         }

    },
 
    updateSettings(obj){
   

           if (this.isvalidFormate(obj.formate)) {
              
             let new_foramte=[];
             for(let item of obj.formate){
               if (this.settings.formate.includes(item)) {
                   
                  new_foramte.push(item);
               }

             }

             this.settings.formate=new_foramte;
           }

           if (this.isValidResize(obj.resize)) {
            this.settings.resize=obj.resize;  
           }

           if (this.isvalidPreset(obj.preset)) {
             this.settings.preset=obj.preset;
           }

           if (this.isvalidSearch(obj.search)) {
             this.settings.search=obj.search;
           }

           if (this.isTrue(obj.fromWeb)) {
             this.settings.fromWeb=obj.fromWeb;
           }

           if (this.isTrue(obj.upload)) {
             this.settings.upload=obj.upload;
           }

           if (obj.hasOwnProperty('done') && obj.done instanceof Function) {
            this.settings.done=obj.done;
           }

           if (obj.hasOwnProperty('edit') && obj.edit instanceof Function) {
            this.settings.edit=obj.edit;
           }

           if (obj.hasOwnProperty('containment') && obj.containment!=null) {
            this.settings.containment=obj.containment;
            }

    },
 
         isTrue(value){
            if (typeof value==='boolean') {
             return true;
             }

             else{
              return false;
             }
         },

        isvalidPreset(preset){
         
         if (preset!==null && preset instanceof Array) {
          return true;
         }
         else{
          return false;
         }
         
        },
 
        isvalidSearch(search){
         if (search!==null && search instanceof Object) {
          return true;
         }
         else{
          return false;
         }
        } 
        ,
     
        flush(){
     
         $(this.$modal_panel).slideDown();
         $(this.$modal_panel).attr('data-state','inactive');
         $(this.$close_panel).css('display','none');
         $(this.$modal_divider).css('display','block');
        this.$modal_footer.css('display','none');
         
         imgPicker.resetImage();
    
    },

    closeSearch(){
          
         $(imgPicker.$search_modal).toggle();
         imgPicker.$modal_container.toggle();
    },


    cancel(){
                 imgPicker.$preset.css('display','block');

          imgPicker.close();

    },
    
    ok(src){
      imgPicker.$preset.css('display','block');
       if (imgPicker.action=='add') {
          imgPicker.setEdited();
        
         if (imgPicker.containment!==null) {
                 
               let image=new Image();

               if (imgPicker.image.edited.src!==null) {
                image.src=imgPicker.image.edited.src;
               }

               else{
                if (imgPicker.image.resized.src!==null) {
                    image.src=imgPicker.image.resized.src;
                }
                else{
                    image.src=imgPicker.image.original.src;
                }
               }
      
           $(imgPicker.settings.containment).append(image);
        
         }
 
         if (imgPicker.settings.hasOwnProperty('done')) {
          imgPicker.settings.done(imgPicker.image);
           
         }
      }
 
      else{
          
          if (imgPicker.settings.hasOwnProperty('edit')) {
          imgPicker.settings.edit($('.image-modal .crop-image').cropper('getCroppedCanvas').toDataURL('image/jpg'));
           
         }
      }
          
         imgPicker.close();
          
    }
        ,
      close(){
      
      $(this.$image_modal).toggle();
      imgPicker.flush();
      },

      closePanel(el){

            $(el).parent().slideUp();
            $(el).parent().attr('data-state','inactive');
            $(this.$modal_panel).slideDown();
            $(this.$modal_divider).toggle();
            $(el).toggle();
            this.resetImage();
              
      }
      , 
        panelActions(el){
              let itsfor=$(el).attr('data-for'),
                  itsparent=$(el).attr('data-parent');
                   
               if ($('.image-modal .'+itsparent).attr('data-state')=='inactive') {
   
               $(this.$modal_panel).slideUp();
               $(this.$modal_divider).toggle();
               $('.image-modal .'+itsparent).find('.close-panel').toggle();
               $('.image-modal .'+itsparent).attr('data-state','active');
               $('.image-modal .'+itsparent).slideDown();

               }
       
               if (itsfor=='upload') {
    
               $(this.$choose_button).click();

               }
               else if(itsfor=='search'){
   
               }
               else if (itsfor=='web') {
    
               }
 
        },

      isvalidFormate(formate){

         if (formate!==null && formate instanceof Array) {
          return true;
         }

         else{
           return false;
         }

      }
      ,

      isValidResize(resize){

        if (resize!==null) {
              
              if (isNaN(resize)) {

             if (resize===false) {
              return true;
            }
            else{
              return false;
            }

          }

          else{
          
          if (resize>0 && resize<1000) {
            return true;
          }
          
          else{
            return false;
          }

          }

        }

        else{
          return false;
        }
          
      },

      isValidLabel(label){
        if (label instanceof String) {
          return true;
        }
        else{
          return false;
        }
      },
        
      addFromWeb(el){
           
             let image_url=$(el).val();
                if (image_url=='') {

                  }
         else{
  
          let testing_image=new Image();
          testing_image.src=image_url;
          testing_image.onload=function(){
 
           imgPicker.fillImage(image_url);
           
           };

         }
    
        },
        validateImage(el,process){
            let response='',
                formate='',
                from='';
             if (process=='upload') {
                let filename=el.files[0].name,
                split= filename.split('.'),
                formate=split[split.length-1];
 
              if (imgPicker.settings.formate.includes(formate)) {
                   
                    var reader=new FileReader();
                             reader.onload=function(event){
                
                             response={
                              name:filename,
                              src:event.target.result,
                              size:el.files[0].size
                             }

                             imgPicker.fillImage({
                              name:filename,
                              src:event.target.result,
                              size:el.files[0].size,
                              from:'user device'
                             });
             
                                };
            reader.readAsDataURL(el.files[0]);
 
              }
              else{
                response=false;
                imgPicker.fillImage(false);

              }
 
             }
             else{

                   let link=$(el).val(),
                       namenfom=link.substr(link.lastIndexOf('/')+1),
                       name=namenfom.substr(0,namenfom.indexOf('.'));

                       formate=link.substr(el.lastIndexOf('.')+1);
                 
                 if (this.settings.formate.includes(formate)) {
                      
                     response={
                      name:name,
                      src:link,
                      formate:formate
                     };

                     imgPicker.fillImage({
                      name:name,
                      src:link,
                      formate:formate,
                      from:link
                     });

                   }

                 else{

                     response=false;
                     imgPicker.fillImage(false);
                 }
                 
             }
                
             
        },

        checkImage(src){
          return new Promise(function(resolve,reject){
            let image =new Image();
            image.src=src;
            image.onload=function(){
                resolve({width:image.width,height:image.height});
            };
            image.onerror=function(){
                reject('failed to load.');
            };
 
          });
        },
        crossOrigin(src){

               let xhr = new XMLHttpRequest(),
                    response='';
                          xhr.responseType = 'blob'; //so you can access the response like a normal URL
                          xhr.onreadystatechange = function () {
                   if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
          
                    response= true;
                   }
                   else{
                     response= false;
                   }
               };

               xhr.open('GET',src, true);
               xhr.setRequestHeader("Access-Control-Allow-Origin","*");
               xhr.send();
                  
               return response;

        },

        doResize(mode,src,width){
         

          if ((imgPicker.settings.resize!==false && width>imgPicker.settings.resize) || mode=='api') {
               
               if (src.indexOf('http')!=-1) {
                          if (imgPicker.crossOrigin(src)) {
                             return true;
                          }
                          else{
                             return false;
                          }
                       }
                        
                       else{
                            return true;
                       }
          }

          else{
            return false;
          }
     
        },

        isEditable(src){
          if (src.indexOf('http')==-1) {
            return true;
          }

          else{
            if (imgPicker.crossOrigin(src)) {
              return true;
            }
            else{
              return false;
            }
          }
        },

        setEdited(){
            let data=$('.image-modal .crop-image').cropper('getData');
            if (data.width==0 && data.height==0 && data.scaleX==1 && data.scaleY==1 && data.rotate==0) {

            }
            else{
              imgPicker.image.edited.src=$('.image-modal .crop-image').cropper('getCroppedCanvas').toDataURL('image/jpg');
                let image=new Image();
                image.src=imgPicker.image.edited.src;
                image.onload=function(){
                  imgPicker.image.edited.width=image.width;
                  imgPicker.image.edited.height=image.height;
                };

            }
        },

        resize(mode,src,w,h){
          
          if (this.doResize(mode,src,null)) {
           let canvas=document.createElement('canvas'),
                       cont=canvas.getContext('2d'),
                       data='',
                       canvas_image=new Image();
                       canvas_image.src=src;
                       canvas.width=w;
  
                       canvas_image.onload=function(){
                        if (h!='auto') {
                           canvas.height=h;  
 
                        }

                         else{
                           let image_ar=canvas_image.width/canvas_image.height;
                              canvas.height=w/image_ar;
                             
                         }
 
                        cont.drawImage(canvas_image,0,0,canvas_image.width,canvas_image.height,0,0,canvas.width,canvas.height);
                        
                             if (mode=='itself') {
                             data={
                                    src:canvas.toDataURL('image/png'),
                                    width:canvas.width,
                                    height:canvas.height

                                  };
                              }
                              else{
                                  data=canvas;
                              }

                       };
                  return data;

          }
          else{
            return false;
          }
        },
        fillImage(response){
          this.$create_image.css('display','block');
          this.$image_loader.css('display','block');
          this.$editing_image.html('');
          
          if (response!==false) {
           imgPicker.image.original.name=response.name;
           imgPicker.image.original.src=response.src;
           imgPicker.image.original.from=response.from;
           imgPicker.image.original.size=response.size | null;
                   
            let imagePromise=imgPicker.checkImage(response.src),
                uploading_src='';

                imagePromise.then(function(value){
                    
                 imgPicker.image.original.width=value.width;
                 imgPicker.image.original.height=value.height;
                 let canvas=document.createElement('canvas'),
                     context=canvas.getContext('2d'),
                     canvas_image=new Image();
                     canvas.width=value.width;
                     canvas.height=value.height;
                     canvas_image.src=response.src;
                     context.drawImage(canvas_image,0,0,canvas_image.width,canvas_image.height,0,0,canvas.width,canvas.height);

                     imgPicker.image.original.dataURL=canvas.toDataURL('image/jpg');
  
              let resize_data=imgPicker.resize('itself',response.src,value.width,value.height);
 
                  if (resize_data!==false) {
 
                  imgPicker.image.resized.width=resize_data.width;
                  imgPicker.image.resized.height=resize_data.height;
                  uploading_src=resize_data.src;
                  imgPicker.image.resized.src=uploading_src;
                    let fill_image=new Image();
                        fill_image.src=canvas.toDataURL('image/png');
                        $(fill_image).css({width:'100%',height:'auto'});
                         imgPicker.displayImage(fill_image);
                 }
                 else{
 
                    if (imgPicker.isEditable(response.src)) {
  
                          uploading_src=response.src;
                      let fill_image=new Image();
                          fill_image.src=response.src;
                          $(fill_image).css({width:'100%',height:'auto'});
                              
                          imgPicker.displayImage(fill_image);
                          }
                          else{
                            
                                 imgPicker.ok(response.src);
                          }

                 }

               
                 },
                function(value){


                 imgPicker.displayImage('<p style="color:white;text-center;margin-top:20px">failed to load image try again</p>');
                }); 
           }

         else{
         imgPicker.displayImage('<p style="color:white;text-center;margin-top:20px">it is not a valid image</p>');  
         }
        },
         resetImage(){
            imgPicker.display_state='no';
            $(imgPicker.$create_image).css('display','none');
            $(imgPicker.$image_loader).css('display','block');
            imgPicker.$modal_footer.css('display','none');
            $('.image-modal .editing-image').html('');
            $('.image-modal .options').css('display','block');
            $('.image-modal .modal-divider').css('display','block');
            $('.image-modal .static-panel-close').css('display','none');
      },
  
      upload(el){
         
        let filename=el.files[0].name,
             split= filename.split('.'),
             format=split[split.length-1];
              if (this.settings.formate.includes(format)) {
             
            var reader=new FileReader();
             reader.onload=function(event){
              
             imgPicker.fillImage(event.target.result);
 
            }
            reader.readAsDataURL(el.files[0]);
            
        }

         else{

            alert('only jpg and png images are allowed.');

        }
  
      },
       displayImage(image){
  
              setTimeout(function(){
                      $(imgPicker.$image_loader).css('display','none');
 
                          $(image).attr('class','crop-image');
                          imgPicker.$editing_image.append(image);
                           $(image).cropper({
                            minCropBoxWidth:150,
                            minCropBoxHeight:150
                          });

                          imgPicker.$rotate.rotatable({
        rotate:function(event,ui){
          $('.image-modal .crop-image').cropper('rotate',ui.angle.degrees);
               
       },
       
      stop:function(event,ui){
                
             }});
        imgPicker.$image_tools.on('click',function(){
        imgPicker.editImage(this);
                  
      });
      imgPicker.$modal_footer.css('display','block');

                        },500);
             }
 
  }
      
   $.fn.imgPicker = function(options=null) {
     
    imgPicker.init(options);
  
   this.each(function(){
  
    $(this).on('click',(event)=>{
      imgPicker.action='add'; 
      imgPicker.show();
       
    });

     });

    let obj={};
    Object.defineProperty(obj,'resize',{value:imgPicker.resize,writable:false,configuarable:false});
    Object.defineProperty(obj,'edit',{value:imgPicker.edit,writable:false,configuarable:false});
    Object.defineProperty(obj,'show',{value:imgPicker.show,writable:false,configuarable:false});
    Object.defineProperty(obj,'image',{value:imgPicker.image,writable:false,configuarable:false});
    Object.freeze(obj.image);
         return obj;

};

},window));