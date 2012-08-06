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
<script src="xrayquire.js"></script>
```

You can use this link to download the latest master version:

https://raw.github.com/requirejs/xrayquire/master/xrayquire.js

or use [volo](https://github.com/volojs/volo) to fetch it for you:

    volo add xrayquire

## Error checks

### Case insensitive ID collisions

Checks for module IDs that differ only by case, which indicates a probable
typing error, or something that will lead to problems on case insensitive
operating systems.

## Information views

There are some information views about the modules that were loaded. These
views are shown by popping a new window to a data: URL that has the display.

These displays are still very new, need lots of work.

### Dependency tree

To see the dependency tree for all the modules loaded, enter the following in
the browser developer tool's console:

    xrayquire.showTree()

### Show cycles

To show cycles (circular dependencies) in the modules loaded, enter the
following in the browser developer tool's console:

    xrayquire.showCycles()
