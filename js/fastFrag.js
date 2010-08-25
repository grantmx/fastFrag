(function(){
    
    
    /*
            Just a little template that takes javascript and uses doc frag...
                Nothing fancy or new, and maybe a little bit dangerous

            only works with host environments that support document.createDocumentFragment()


            usage

            // element 'type' is always assumed to be a div unless otherwise noted via 'type' attr
            fastFrag.create({
                css : "a_class_name",
                content : "string here"
            })
            content is REQUIRED, set to empty string or element is skipped (when === undefined )

            //returns <div class="a_class_name">string here</div>

            Get more complex with with nested elements:

            fastFrag.create({
                css : "a_class_name",
                content : [{
                    type : "a"
                    content : "child one",
                    attributes : {
                        href : "http://whatever.com"
                    }
                }, {
                    content : "child two"
                }]
            })   

            // returns   
            <div class="a_class_name">
                <a href="http://whatever.com">child one</a>
                <div>child two</div>
            </div>        


    */
    
    var fastFrag = {

        create : function( params ) {
            return drawHTML(params);
        }
        
    };
    window.fastFrag = fastFrag;    
    

    var safe_el = ["script","img","a","link","li","ul","canvas","div","input","select","options","option",
                    "h1","span","h2","h3","h4","h5","h6","b","strong"],
        d = document, reg1=new RegExp('&', 'mgi'), reg2=new RegExp('"', 'mgi'), 
        reg3 = new RegExp("'", 'mgi'), reg4=new RegExp('>', 'mgi'), reg5= new RegExp('<', 'mgi');    
    
    function _mke(elem) {
        return document.createElement( elem );
    }
    function _mke_attribute( el, attrs ) {
        for(var k in attrs) {
            el.setAttribute(k, _safe( attrs[k] ) );
        }
        
        return el;
    }
    
    function _safe( string ) {
        // also called escaper, breaking it out.
        return (string && string.replace(reg1, "&amp;").replace(reg2, "&quot;").replace(reg3, "&#39;")
                     .replace(reg4, "&gt;").replace(reg5, "&lt;") ) || "";
    }    
    function drawHTML( params ) {        
        var el_name, frag = d.createDocumentFragment(), k, el, txt, o, key, content_type;        
        for(k in params) {
            o = params[k];
            if(o.content === undefined) { continue; }
            content_type = typeof o.content;            
            
            el_name = ( safe_el.indexOf( o.type ) > -1 ) ? o.type : "div";
            el = _mke( el_name );
            _mke_attribute(el, o.attributes);
            el.id = (o.id) ? o.id : null;
            el.className = (o.css) ? o.css : null;
            
            txt=null;    
            if( content_type === "object") {
                txt = drawHTML( o.content );
            } else if(content_type === "string") {
                txt = d.createTextNode( _safe( o.content ) );
            } else {
                txt = d.createTextNode( _safe( o.content.toString() ) )
            }
            el.appendChild( txt );  
            frag.appendChild(el);
        }
        return frag;
    }    
    
})();