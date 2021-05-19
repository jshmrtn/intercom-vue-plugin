# intercom.com Vue.js Plugin

A reactive wrapper for [Intercom's](https://www.intercom.com/) [JavaScript API](https://developers.intercom.com/docs/intercom-javascript)

## Installation

```bash
npm install intercom-vue-plugin
```

In src/main.js 
```javascript
import Vue from 'vue';
import IntercomVuePlugin from '@leadent/intercom-vue-plugin';

Vue.use(IntercomVuePlugin, { app_id: 'your-app-id' });
```
Note: Option parameters can be set when initalising the plugin (as above) or when booting the plugin (as below) which will override any initial options settings.
## Usage

`intercom-vue-plugin` handles the injection of Intercom's script into your html and wraps calls to the Intercom API with methods and exposes them through the `$intercom` object in your components.

```javascript
new Vue({
  el: '#app',
  data() {
    return {
      userId: 1,
      name: 'Foo Bar',
      email: 'foo@bar.com',
    };
  },
  mounted() {
    this.$intercom.boot({
      user_id: this.userId,
      name: this.name,
      email: this.email,
    });
    this.$intercom.show();
  },
  watch: {
    email(email) {
      this.$intercom.update({ email });
    },
  }
});
```

## Example App

```
cd example
npm run serve
```

## API

### Values

#### `$intercom.ready`

Set to `true` once the Intercom script has been loaded. There is no need to wait for this property, the plugin watches this internally and will only pass user calls to methods and properties to Intercom once this is `true`. 

#### `$intercom.visible`

Set via the `onShow`/`onHide` events.

#### `$intercom.unreadCount`

Set via the `onUnreadCountChange` event.

### Methods

#### `$intercom.boot(/* optional */options)`

Calls `Intercom('boot')`. Automatically sets the `app_id` unless specified in the options object.

#### `$intercom.shutdown()`

Calls `Intercom('shutdown')`.

#### `$intercom.update(/* optional */options)`

Calls `Intercom('update')`. If the options object is set, calls `Intercom('update', options)`

#### `$intercom.show()`

Calls `Intercom('show')`.

#### `$intercom.hide()`

Calls `Intercom('hide')`.

#### `$intercom.showMessages()`

Calls `Intercom('showMessages')`.

#### `$intercom.showNewMessage(/* optional */content)`

Calls `Intercom('showNewMessage')` with pre-populated content if provided.

#### `$intercom.trackEvent(name, /* optional */metadata)`

Calls `Intercom('trackEvent')` with extra metadata if provided.

#### `$intercom.getVisitorId()`

Calls `Intercom('getVisitorId')`

#### `$intercom.getVisitorId()`

Calls `Intercom('getVisitorId')`

#### `$intercom.startTour()`

Calls `Intercom('startTour')`

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2021 Leadent Digital
