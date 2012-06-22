# xrayrequire

An introspection tool for RequireJS. It dives into the the internals of
RequireJS to show you information on the modules you load and flags some
potential problems.

This is still under development. See the
[issues area](https://github.com/requirejs/xrayquire/issues) for the features
that it may support in the future.

See the tests directory for examples of the items xrayrequire checks.

## Usage

Place it as a script tag right after require.js:

```html
<script src="require.js"></script>
<script src="xrayrequire.js"></script>
```

## Error checks

### Case insensitive ID collisions

Checks for module IDs that differ only by case, which indicates a probable
typing error, or something that will lead to problems on case insensitive
operating systems.
