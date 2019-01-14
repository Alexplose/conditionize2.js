A jQuery plugin for handling showing and hiding things conditionally based on input - typically groups of form fields. It works using data attributes to keep all of the name/values for inputs directly in the markup and saves you the trouble of having to manually show/hide a bunch of stuff through JS, as well as improving maintenance if you need to change the name or value of an input you were listening to. Conditionize supports the following field types: checkboxes, radio buttons, selects, and all HTML5 input types.


# General usage
1. Set attributes in a container you want to be conditional.  **Both `name` and `id` references can be used.**
2. Then, call conditionize on the class...

```javascript
  $('.conditional').conditionize();
```

If you'd prefer to use CSS to hide everything that is to be shown conditionally...

```javascript
  $('.conditional').conditionize({
    hideJS: false
  });
```

# conditionize2.js
Improved version of conditionize.js.

## Set attributes
Just set one attribute `data-condition`. conditionize.flexible runs through all words in `data-condition`, and if it's a DOM element replaces it by its value. So, any javascript staement can be used, i.e. even conditions like `['str1','str2'].includes(myinput)`. Fields can be reffered eather by id like `#input_id == 1` or by name: `input_name == 1`.

**Supported names/ids:** Any string consisting of lower and upper case letters(`a-z` and `A-Z`), digits(`0-9`), underscores(`_`) and hyphen(`-`). At least one character(`a-z` or `A-Z`) is required.

**NOTE:** This is different from HTML5 standard. HTML5 allows any character except any type of space character. And, it must not be empty string.

**NOTE:** Strings inside double or single quotes are ignored, i.e. you can even write a condition like "myInputName == 'myInputName'"

```html
    <p><label><input type="checkbox" id="example1"> Are you sure?</label></p>
    <!-- This will be open only if #example1 is checked -->
    <p class="conditional" data-condition="#example1">
        <label><input type="checkbox" name="example2"> Really super sure?</label>
    </p>
    <!-- This will be open only if both #example1 example2 are checked -->
    <p class="conditional" data-condition="#example1 && example2">
        <label>Then type "yay": </label>
        <input type="text" name="yay" placeholder="yay">
    </p>
    <!-- This will be shown only if BOTH examle1 and examle2 are checked 
           AND 'yay' typed in examle3 -->
    <p class="conditional msg" 
       data-condition="#example1 && example2 && yay == 'yay'">
        Both are selected and YAY is typed!
    </p>
    <!-- This is also works with selects -->
    <p>
        <label>Pick two or three:</label>
        <select class="select" name="-example_5">
            <option>....</option>
            <option value="one">One!</option>
            <option value="two">Two!</option>
            <option value="three">Three!</option>
            <option value="four">Four!</option>
        </select>
    </p>
    <!-- NOTE: IE browsers do not support *.includes(...) function. 
        So on production, it is better to use (-example_5 == 'two') || (-example_5 == 'three') -->
    <div class="conditional msg" 
         data-condition="['two','three'].includes(-example_5)">
        See?! It works with selects!
    </div>
```

## Demo
https://codepen.io/rguliev/pen/geyeOB

