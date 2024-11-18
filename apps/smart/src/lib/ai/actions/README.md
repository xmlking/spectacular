# Actions

- Use [generics](https://github.com/thisuxhq/SvelteDnD/blob/main/src/lib/actions/droppable.ts)
- Element, Parameters(options), Attributes(custom events)
- use optional Parameters with default values (callback, ..._options)
- Past-outside, only when past outside. exclude action for all pasts with-in input fields
- fire `error` event only target to the `node`, no-bobble, bubbles, composed
- despatch `CustomEvent` `onPast`
- shared state for chromeAI capabilities
- document: order of callbacks and actions  - foot-gun
- any button also should be able to fire Cntl+V event or custom doPast event, which should trigger action to run.
- Example to set custom validation error for html elements [here](https://github.com/diamondburned/e2clicker/blob/v2/frontend/routes/(pages)/settings/inputs.svelte.ts)
- debounce
- The order is important if you want to dispatch the event when the element is created. You have to add the `on:greet` event listener first, and then use the `use:greet` action.
- input validation <https://github.com/diamondburned/e2clicker/blob/v2/frontend/routes/(pages)/settings/inputs.svelte.ts>

```js
this.dispatchEvent(
  new CustomEvent('error', { 
    bubbles: false,
    cancelable: true,
    composed: false,
    message: errorMessage  // Note that message must be a string, use JSON.stringify if needed
  }
)

var error = new ErrorEvent('oh nose', {
    error : new Error('AAAHHHH'),
    message : 'A monkey is throwing bananas at me!',
    lineno : 402,
    colno: 33,
    filename : 'closet.html'
});
```
