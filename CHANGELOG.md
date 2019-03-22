## v2.0.0-alpha.7 [unreleased]

### Features

1. [12663](https://github.com/influxdata/influxdb/pull/12663): Insert flux function near cursor in flux editor
1. [12678](https://github.com/influxdata/influxdb/pull/12678): Enable the use of variables in the Data Explorer and Cell Editor Overlay
1. [12655](https://github.com/influxdata/influxdb/pull/12655): Add a variable control bar to dashboards to select values for variables.
1. [12706](https://github.com/influxdata/influxdb/pull/12706): Add ability to add variable to script from the side menu.
1. [12791](https://github.com/influxdata/influxdb/pull/12791): Use time range for metaqueries in Data Explorer and Cell Editor Overlay
1. [12821](https://github.com/influxdata/influxdb/pull/12821): Allow variables to be re-ordered within control bar on a dashboard.

### Bug Fixes

1. [12684](https://github.com/influxdata/influxdb/pull/12684): Fix mismatch in bucket row and header
1. [12703](https://github.com/influxdata/influxdb/pull/12703): Allows user to edit note on cell
1. [12764](https://github.com/influxdata/influxdb/pull/12764): Fix empty state styles in scrapers in org view
1. [12790](https://github.com/influxdata/influxdb/pull/12790): Fix bucket creation error when changing rentention rules types.
1. [12793](https://github.com/influxdata/influxdb/pull/12793): Fix task creation error when switching schedule types.
1. [12805](https://github.com/influxdata/influxdb/pull/12805): Fix hidden horizonal scrollbars in flux raw data view
1. [12827](https://github.com/influxdata/influxdb/pull/12827): Fix screen tearing bug in Raw Data View

### UI Improvements

1. [12782](https://github.com/influxdata/influxdb/pull/12782): Move bucket selection in the query builder to the first card in the list

## v2.0.0-alpha.6 [2019-03-15]

### Release Notes

We have updated the way we do predefined dashboards to [include Templates](https://github.com/influxdata/influxdb/pull/12532) in this release which will cause existing Organizations to not have a System dashboard created when they build a new Telegraf configuration. In order to get this functionality, remove your existing data and start from scratch.

**NOTE: This will remove all data from your InfluxDB v2.0 instance including timeseries data.**

On most `linux` systems including `macOS`:

```sh
$ rm -r ~/.influxdbv2
```

Once completed, `v2.0.0-alpha.6` can be started.

### Features

1. [12496](https://github.com/influxdata/influxdb/pull/12496): Add ability to import a dashboard
1. [12524](https://github.com/influxdata/influxdb/pull/12524): Add ability to import a dashboard from org view
1. [12531](https://github.com/influxdata/influxdb/pull/12531): Add ability to export a dashboard and a task
1. [12615](https://github.com/influxdata/influxdb/pull/12615): Add `run` subcommand to influxd binary. This is also the default when no subcommand is specified.
1. [12523](https://github.com/influxdata/influxdb/pull/12523): Add ability to save a query as a variable from the Data Explorer.
1. [12532](https://github.com/influxdata/influxdb/pull/12532): Add System template on onboarding

### Bug Fixes

1. [12641](https://github.com/influxdata/influxdb/pull/12641): Stop scrollbars from covering text in flux editor

### UI Improvements

1. [12610](https://github.com/influxdata/influxdb/pull/12610): Fine tune keyboard interactions for managing labels from a resource card

## v2.0.0-alpha.5 [2019-03-08]

### Release Notes

This release includes a [breaking change](https://github.com/influxdata/influxdb/pull/12391) to the format that TSM and index data are stored on disk.
Any existing local data will not be queryable once InfluxDB is upgraded to this release.
Prior to installing this release we recommend all storage-engine data is removed from your local InfluxDB `2.x` installation; this can be achieved without losing any of your other InfluxDB `2.x` data (settings etc).
To remove only local storage data, run the following in a terminal.

On most `linux` systems:

```sh

# Replace <username> with your actual username.

$ rm -r /home/<username>/.influxdbv2/engine
```

On `macOS`:

```sh
# Replace <username> with your actual username.

$ rm -r /Users/<username>/.influxdbv2/engine
```

Once completed, `v2.0.0-alpha.5` can be started.

### Features

1. [12096](https://github.com/influxdata/influxdb/pull/12096): Add labels to cloned tasks
1. [12111](https://github.com/influxdata/influxdb/pull/12111): Add ability to filter resources by clicking a label
1. [12401](https://github.com/influxdata/influxdb/pull/12401): Add ability to add a member to org
1. [12391](https://github.com/influxdata/influxdb/pull/12391): Improve representation of TSM tagsets on disk
1. [12437](https://github.com/influxdata/influxdb/pull/12437): Add ability to remove a member from org

### Bug Fixes

1. [12302](https://github.com/influxdata/influxdb/pull/12302): Prevent clipping of code snippets in Firefox
1. [12379](https://github.com/influxdata/influxdb/pull/12379): Prevent clipping of cell edit menus in dashboards

### UI Improvements

1. [12302](https://github.com/influxdata/influxdb/pull/12302): Make code snippet copy functionality easier to use
1. [12304](https://github.com/influxdata/influxdb/pull/12304): Always show live preview in Note Cell editor
1. [12317](https://github.com/influxdata/influxdb/pull/12317): Redesign Create Scraper workflow
1. [12317](https://github.com/influxdata/influxdb/pull/12317): Show warning in Telegrafs and Scrapers lists when user has no buckets
1. [12384](https://github.com/influxdata/influxdb/pull/12384): Streamline label addition, removal, and creation from the dashboards list
1. [12464](https://github.com/influxdata/influxdb/pull/12464): Improve label color selection

## v2.0.0-alpha.4 [2019-02-21]

### Features

1. [11954](https://github.com/influxdata/influxdb/pull/11954): Add the ability to run a task manually from tasks page
1. [11990](https://github.com/influxdata/influxdb/pull/11990): Add the ability to select a custom time range in explorer and dashboard
1. [12009](https://github.com/influxdata/influxdb/pull/12009): Display the version information on the login page
1. [12011](https://github.com/influxdata/influxdb/pull/12011): Add the ability to update a Variable's name and query.
1. [12026](https://github.com/influxdata/influxdb/pull/12026): Add labels to cloned dashboard
1. [12018](https://github.com/influxdata/influxdb/pull/12057): Add ability filter resources by label name
1. [11973](https://github.com/influxdata/influxdb/pull/11973): Add ability to create or add labels to a resource from labels editor

### Bug Fixes

1. [11997](https://github.com/influxdata/influxdb/pull/11997): Update the bucket retention policy to update the time in seconds

### UI Improvements

1. [12016](https://github.com/influxdata/influxdb/pull/12016): Update the preview in the label overlays to be shorter
1. [12012](https://github.com/influxdata/influxdb/pull/12012): Add notifications to scrapers page for created/deleted/updated scrapers
1. [12023](https://github.com/influxdata/influxdb/pull/12023): Add notifications to buckets page for created/deleted/updated buckets
1. [12072](https://github.com/influxdata/influxdb/pull/12072): Update the admin page to display error for password length

## v2.0.0-alpha.3 [2019-02-15]

### Features

1. [11809](https://github.com/influxdata/influxdb/pull/11809): Add the ability to name a scraper target
1. [11821](https://github.com/influxdata/influxdb/pull/11821): Display scraper name as the first and only updatable column in scrapers list
1. [11804](https://github.com/influxdata/influxdb/pull/11804): Add the ability to view runs for a task
1. [11824](https://github.com/influxdata/influxdb/pull/11824): Display last completed run for tasks list
1. [11836](https://github.com/influxdata/influxdb/pull/11836): Add the ability to view the logs for a specific task run

### Bug Fixes

1. [11819](https://github.com/influxdata/influxdb/pull/11819): Update the inline edit for resource names to guard for empty strings
1. [11852](https://github.com/influxdata/influxdb/pull/11852): Prevent a new template dashboard from being created on every telegraf config update
1. [11848](https://github.com/influxdata/influxdb/pull/11848): Fix overlapping buttons in the telegrafs verify data step

### UI Improvements

1. [11764](https://github.com/influxdata/influxdb/pull/11764): Move the download telegraf config button to view config overlay
1. [11879](https://github.com/influxdata/influxdb/pull/11879): Combine permissions for user by type
1. [11938](https://github.com/influxdata/influxdb/pull/11938): Add ordering to UI list items

## v2.0.0-alpha.2 [2019-02-07]

### Features

1. [11677](https://github.com/influxdata/influxdb/pull/11677): Add instructions button to view `$INFLUX_TOKEN` setup for telegraf configs
1. [11693](https://github.com/influxdata/influxdb/pull/11693): Save the \$INFLUX_TOKEN environmental variable in telegraf configs
1. [11700](https://github.com/influxdata/influxdb/pull/11700): Update Tasks tab on Org page to look like Tasks Page
1. [11740](https://github.com/influxdata/influxdb/pull/11740): Add view button to view the telegraf config toml
1. [11522](https://github.com/influxdata/influxdb/pull/11522): Add plugin information step to allow for config naming and configure one plugin at a time
1. [11758](https://github.com/influxdata/influxdb/pull/11758): Update Dashboards tab on Org page to look like Dashboards Page
1. [11810](https://github.com/influxdata/influxdb/pull/11810): Add tab for template variables under organizations page

## Bug Fixes

1. [11678](https://github.com/influxdata/influxdb/pull/11678): Update the System Telegraf Plugin bundle to include the swap plugin
1. [11722](https://github.com/influxdata/influxdb/pull/11722): Revert behavior allowing users to create authorizations on behalf of another user

### UI Improvements

1. [11683](https://github.com/influxdata/influxdb/pull/11683): Change the wording for the plugin config form button to Done
1. [11689](https://github.com/influxdata/influxdb/pull/11689): Change the wording for the Collectors configure step button to Create and Verify
1. [11697](https://github.com/influxdata/influxdb/pull/11697): Standardize page loading spinner styles
1. [11711](https://github.com/influxdata/influxdb/pull/11711): Show checkbox on Save As button in data explorer
1. [11705](https://github.com/influxdata/influxdb/pull/11705): Make collectors plugins side bar visible in only the configure step
1. [11745](https://github.com/influxdata/influxdb/pull/11745): Swap retention policies on Create bucket page

## v2.0.0-alpha.1 [2019-01-23]

### Release Notes

This is the initial alpha release of InfluxDB 2.0.
