# conditionize2.js
A flexible jQuery plugin for conditional actions (*like showing and hiding elements, triggering events or whatever else you need*) based on values of one or many fields. This is an improved version of `conditionize.js` jQuery plugin. Unlike the previous version, `conditionize2.js` is not restricted to only show and hide actions. But for simpler migration from `conditionize.js` to  `conditionize2.js`, show/hide is the default behaviour.

**A lot of EXAMPLES available** [here](https://rguliev.github.io/conditionize2.js/test/manual.html)

# Table of contents
- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Conditions](#conditions)
  * [Fields reference](#fields-reference)
  * [Supported names/ids](#supported-names-ids)
  * [Multi-value fields](#multi-value-fields)
- [Options](#options)
  * [Update events: `updateOn`](#update-events)
  * [On load: `onload`](#on-load)
  * [Actions: `ifTrue` / `ifFalse`](#actions)
    + [Available built-in handlers](#available-built-in-handlers)
      - [ignore](#ignore)
      - [show](#show)
      - [hide](#hide)
      - [clearFields](#clearfields)
      - [trigger](#trigger)
- [Migration](#migration)
  * [From `conditionize.flexible.js`](#from-conditionize-flexible)
  * [From `conditionize.js`](#from-conditionize)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

# Installation
There is nothing special in installation:
1. [Source jQuery](https://jquery.com/download/) *(tested on 1.\*, 2.\*, and 3.\* versions of jQuery)*
2. Source `conditionize2.js`. From a file:
```html
<script src="js/jquery.conditionize2.min.js"></script>
```
Sourcing by **CDN** is also possible:
```html
<!-- The latest version. Not recommended for production -->
<script src="https://cdn.jsdelivr.net/gh/rguliev/conditionize2.js/jquery.conditionize2.min.js"></script>

<!-- A certain version -->
<script src="https://cdn.jsdelivr.net/gh/rguliev/conditionize2.js@2.0.1/jquery.conditionize2.min.js"></script>
```

**NPM** installation is not available for now but it is in the plan.

# Basic usage
1. Add your condition in a `data-condition` attribute for a container you want to be conditional. **Both `name` and `id` references can be used**. For example
```html
<input type="text" name="myInput">
<div class="my-conditional-div" data-condition="myInput === 'foo'">
    This div is conditional
</div>
```
2. Then, just call conditionize on a selector
```js
$(".my-conditional-div").conditionize();
```
By default, it will show a conditional element if the condition in `data-condition` is true, and will hide it otherwise. But you can change this behaviour any way you want. Read more about options below.

# Conditions
In order to set a contidion just add one attribute `data-condition` to your conditional element.  The plugin runs through all words in `data-condition` and replaces it by its value, if it's a DOM element. So, **any javascript staement can be used**, i.e. even conditions like `['str1','str2'].includes(myInput)` or `myInput.indexOf('str') !== -1`.

## Fields reference
Fields can be reffered eather by id or by name. Names starting with `#` are considered to be an id. For example:
- `#myInput === '1'` means "if a value of the element with id `myInput` is equal to `'1'`";
- `myInput === '1'` means "if a value of the element with name `myInput` is equal to `'1'`".

<a name="supported-names-ids"></a>
## Supported names/ids
Any string consisting of lower and upper case letters(`a-z` and `A-Z`), digits(`0-9`), underscores(`_`), hyphen(`-`), and brackets(`[`,`]`).

:warning: **NOTE:** This is different from HTML5 standard. HTML5 allows any character except any type of space character. And, it must not be an empty string.

:warning: **NOTE:** Strings inside double or single quotes are ignored, i.e. you can even write a condition like `"myInputName == 'myInputName'"`.

## Multi-value fields
The case of multi-value fields is a special. Since a condition becomes ambigous. Thus, **if a field has more than one value, it will be replaced in the condition by an array of all its values.** For example:
```html
<input type="text" name="my_favorite_books[]">
<input type="text" name="my_favorite_books[]">
<input type="text" name="my_favorite_books[]">
<div class="conditional" data-condition="my_favorite_books[].indexOf('Harry Potter') !== -1 ">
I like it too!
</div>
<p class="conditional" data-condition="favorite_book[].every(x=>x !== '')">
You read too much:)
</p>
<script>$(".conditional").conditionize();</script>
```
In such case, `my_favorite_books[]` is replaced in the condition by array of three values and the condition is `[<value of input1>, <value of input2>, <value of input3>].indexOf('Harry Potter') !== -1`, which is true only if one of the values is 'Harry Porrer'.
Note. You are not restircted to `indexOf` function. Any array function or attribute works, i.e. `filter`, `map`, `length`, etc.. For example:
```html
<!-- If all fields are filled -->
<p class="conditional" data-condition="favorite_book[].every(x=>x !== '')">
You read too much:)
</p>
```

# Options
Here is the list of all available options and their default values. Below you can find a description for each of them. A lot of examples available [here](https://rguliev.github.io/conditionize2.js/test/manual.html#section-10).
```js
{
    // Events on which to update a condition
    updateOn: "change",
    // Check condition on page load?
    onload: true,
    // Actions to do if condition is true and otherwise
    ifTrue: "show",
    ifFalse: "hide"
}
```
<a name="update-events"></a>
## Update events: `updateOn`
A string or an array of strings of events on which to update a condition value. By defalut the value is `"change"`, which means that `data-condition` value will be updated when any field in the condition trigger `"change"` event. You might want to update the condition on `keyup` event as well, then just set the value to `["change", "keyup"]`. It is recommended to keep `"change"` event since not all inputs trigger `"keyup"`.
**Example:**
```html
<label><input type="text" name="foo">Type "foo"</label>
<p class="conditional" data-condition="foo==='foo'">Works with many events in one string!</p>
<script>
    $('p.conditional').conditionize({
        updateOn:['change', 'mouseleave']
    });
</script>
```

<a name="on-load"></a>
## On load: `onload`
A boolean field indicating whether or not check conditions when a page is loaded. It is a special case, what to do on a page load. Because no `updateOn` event is triggered when the page had been loaded. So conditional actions cannot run. Thus, this option was added to give control of onload actions. If `true`, the `data-condition` will be calculated on the page load and the correcponding action will be done. Otherwise (i.e. if `false`), you take your responsibility on what to do on the page load. For example, you might have default CSS styles hiding everything, so there is no need for checking conditions.
If you used the previous version of the plugin (`conditionize.js`) then you might consider this option something like `hideJS` in the previous version. That is why `hideJS` option was removed.
**Example:**
```html
<label><input type="checkbox" id="mycheckbox">Some checkbox. Toggle it.</label>
<p class="conditional-no-onload" data-condition="#mycheckbox">
You see this text when page is loaded. But it works if you toggle the checkbox.
</p>
<script>
    $('p.conditional-no-onload').conditionize({
        onload: false
    });
</script>
```

<a name="actions"></a>
## Actions: `ifTrue` / `ifFalse`
Set actions you want to be implemented when the condition is true and when it is false correspondingly. A value must be one of the following:
* a function of structure `function($section) {...}`, where `$section` is the conditional section
* a string, a name of a built-in action; built-in actions are simple wrappers for the most common handlers like "show an element" or "hide an element". The full list of built-in actions is available below.
* an array consisting of strings and/or function described above, i.e. you can combine multiple actions like `ifFalse: ["hide", "clearFields", function($s) { alert("Hiding the element"); }]`
* Values `"ignore"`, `[]`, `false` are synonymous and mean that the condition state will be ignored, i.e. no action will be implemented.

### Available built-in handlers

#### ignore
`"ignore"` is the same as `[]` or `false`. Means "do nothing". For example:
```html
<label><input name="checkbox" type="checkbox">Check me many times</label>
<p id="counter" data-condition="checkbox">Checkbox was checked 0 times.</p>
<script>
 var counter = 0;
 $("#counter").conditionize({
    ifTrue: function($s) {
        counter++;
        $s.text("Checkbox was checked " + counter + " times.")
    },
    ifFalse: "ignore"
});
</script>
```

#### show
`"show"` action calls jQuery `slideDown()` method on the section, i.e. is simpy a wrapper for `function( $s ) { $s.slideDown(); }` action, which is default behaviour in the previous version of conditionize.

#### hide
Like the previous action, `"hide"` action calls jQuery `slideUp()` method on the section, i.e. is simpy a wrapper for `function( $s ) { $s.slideUp(); }` action, which is default behaviour in the previous version of conditionize.

#### clearFields
A conditional section can contain form inputs or selects. In some cases it is important to clear the values to not send invalid data to a server. For example, let's assume we have a form with a section like following:
```html
  <label><input name="hasCar" type="checkbox">Do you have a car?</label>

  <fieldset class="carSubForm" data-condition="hasCar">

    <label for="carColor">What is the color?</label>
    <input name="carColor" type="text">

    <label for="carColor">What is the model?</label>
    <input name="carModel" type="text">

  </fieldset>
```
Now, what will happen with dependent fields if a user checks the checkbox and fills all fields but then unchecks checkbox back? For example, he forgot that he just sold the car. By default, values will be kept, so, in your database, you will see a user who does not have a car (`hasCar` is false) but have a car colour and model. In order to prevent such situations, add `"clearFields"` action which will clear all fields in the conditional section, like so:
```js
$(".carSubForm").conditionize({
  ifTrue: "show",
  ifFalse: ["hide", "clearFields"]
});
```

#### trigger
You might also need to trigger an event (or events) in other to handle it somewhere else. `"trigger"` option allows you to do so. The syntax is the following:
- `"trigger"` - this will trigger events from `updateOn` parameter
- `"trigger:event"` - this will trigger `event`
- `"trigger:event1 event2 event3"` - this will trigger three events: `event1`, `event2`, and `event3`.
For example
```js
$('.conditional').conditionize({
    ifTrue: "trigger:click yourCustomEvent",
    ifFalse: "ignore"
});
```

# Migration
If you used `hideJS` option, play with `onload` parameter. `onload: false` supposed to give similar results as `hideJS: false`. But be careful because they are not completely equivalent.

<a name="from-conditionize-flexible"></a>
## From `conditionize.flexible.js`
Moving from `conditonize.flexible.js` is quite simple because you do not need to change conditions. `$("...").conditionize();` in the last version ([1548eff](https://github.com/renvrant/conditionize.js/commit/1548eff9745486a8a105ab019f1e20cd9e349bb9)) of `conditionize.flexible.js`  is equalent to `$("...").conditionize({ ifFalse: ["hide", "clearFields"] })` in the `conditionize2.js`. If you do not want fields to be cleared on hiding, then just leave it like `$("...").conditionize();`, i.e. in such you do need to change anything.

<a name="from-conditionize"></a>
## From `conditionize.js`
Migration from `conditionize.js` is more complicated because you will have to change condition arguments. Change your condition atributes from `<data-cond-option, data-cond-value[, data-cond-operator]>` to one atribute `data-condition`. For example:
```html
<label for="foo"><input name="foo" type="text">Foo</label>
<div class="conditional" data-cond-option="foo" data-cond-value="bar">Bar</div>
```
Must be changed to:
```html
<label for="foo"><input name="foo" type="text">Foo</label>
<div class="conditional" data-condition="foo == 'bar'">Bar</div>
```
