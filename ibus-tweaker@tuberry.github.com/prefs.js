// vim:fdm=syntax
// by:tuberry@github
//
const { Gio, Gtk, GObject } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const _ = imports.gettext.domain(Me.metadata['gettext-domain']).gettext;

const gsettings = ExtensionUtils.getSettings();
const ibusGsettings = new Gio.Settings({ schema_id: 'org.freedesktop.ibus.panel' });

var Fields = {
    ACTIVITIES:    'activities',
    ASCIIMODE:     'ascii-mode',
    SHORTCUT:      'run-dialog',
    CUSTOMFONT:    'custom-font',
    UPDATESDIR:    'updates-dir',
    CHECKUPDATES:  'check-updates',
    ENABLEHOTKEY:  'enable-hotkey',
    INPUTONLIST:   'input-on-list',
    ENABLEUPDATES: 'enable-updates',
    INPUTOFFLIST:  'input-off-list',
    MSTHEMECOLOR:  'ms-theme-color',
    ENABLEMSTHEME: 'enable-ms-theme',
    INPUTLIST:     'input-mode-list',
    MSTHEMESTYLE:  'default-variant',
    USECUSTOMFONT: 'use-custom-font',
    MSTHEMENIGHT:  'enable-night-mode',
    AUTOSWITCH:    'enable-auto-switch',
    ENABLEORIEN:   'enable-orientation',
    UNKNOWNSTATE:  'unkown-ascii-state',
    ORIENTATION:   'candidate-orientation',
};

function buildPrefsWidget() {
    return new IBusTweaker();
}

function init() {
    ExtensionUtils.initTranslations();
}

const IBusTweaker = GObject.registerClass(
class IBusTweaker extends Gtk.ScrolledWindow {
    _init() {
        super._init({
            hscrollbar_policy: Gtk.PolicyType.NEVER,
        });

        this._palatte = [_('Red'), _('Green'), _('Orange'), _('Blue'), _('Purple'), _('Turquoise'), _('Grey')];
        this._bulidWidget();
        this._bulidUI();
        this._bindValues();
        this._syncStatus();
        this.show_all();
    }

    _bulidWidget() {
        this._field_enable_hotkey   = this._checkMaker(_('Run dialog'));
        this._field_enable_night    = this._checkMaker(_('Night mode'));
        this._field_activities      = this._checkMaker(_('Hide Activities'));
        this._field_enable_ms_theme = this._checkMaker(_('MS IME theme'));
        this._field_use_custom_font = this._checkMaker(_('Use custom font'));
        this._field_enable_ascii    = this._checkMaker(_('Auto switch ASCII mode'));
        this._field_enable_orien    = this._checkMaker(_('Candidates orientation'));

        this._field_theme_color  = this._comboMaker(this._palatte);
        this._field_run_dialog   = this._shortCutMaker(Fields.SHORTCUT);
        this._field_variant      = this._comboMaker([_('Light'), _('Dark')]);
        this._field_orientation  = this._comboMaker([_('Vertical'), _('Horizontal')]);
        this._field_unkown_state = this._comboMaker([_('On'), _('Off'), _('Default')]);
        this._field_custom_font  = new Gtk.FontButton({ font_name: gsettings.get_string(Fields.CUSTOMFONT) });
    }

    _bulidUI() {
        this._box = new Gtk.Box({
            margin: 30,
            orientation: Gtk.Orientation.VERTICAL,
        });
        this.add(this._box);
        this._ibus = this._listFrameMaker(_('IBus'));
        this._ibus._add(this._field_enable_night,    this._field_variant);
        this._ibus._add(this._field_enable_hotkey,   this._field_run_dialog);
        this._ibus._add(this._field_enable_ms_theme, this._field_theme_color);
        this._ibus._add(this._field_enable_orien,    this._field_orientation);
        this._ibus._add(this._field_use_custom_font, this._field_custom_font);
        this._ibus._add(this._field_enable_ascii,    this._field_unkown_state);

        this._others = this._listFrameMaker(_('Others'), 30);
        this._others._add(this._field_activities);
    }

    _syncStatus() {
        this._field_enable_hotkey.connect('notify::active', widget => {
            this._field_run_dialog.set_sensitive(widget.active);
        });
        this._field_enable_ascii.connect('notify::active', widget => {
            this._field_unkown_state.set_sensitive(widget.active);
        });
        this._field_enable_orien.connect('notify::active', widget => {
            this._field_orientation.set_sensitive(widget.active );
        });
        this._field_enable_night.connect('notify::active', widget => {
            this._field_variant.set_sensitive(!widget.active & this._field_enable_ms_theme.active);
        });
        this._field_use_custom_font.connect('notify::active', widget => {
            this._field_custom_font.set_sensitive(widget.active);
            ibusGsettings.set_boolean('use-custom-font', widget.active);
        });
        this._field_enable_ms_theme.connect('notify::active', widget => {
            this._field_theme_color.set_sensitive(widget.active);
            this._field_enable_night.set_sensitive(widget.active);
            this._field_variant.set_sensitive(widget.active & !this._field_enable_night.active);
        });
        this._field_custom_font.connect('font-set', widget => {
            ibusGsettings.set_string('custom-font', widget.font_name);
            gsettings.set_string(Fields.CUSTOMFONT, widget.font_name);
        });

        this._field_unkown_state.set_sensitive(this._field_enable_ascii.active);
        this._field_orientation.set_sensitive(this._field_enable_orien.active);
        this._field_run_dialog.set_sensitive(this._field_enable_hotkey.active);
        this._field_custom_font.set_sensitive(this._field_use_custom_font.active);
        this._field_theme_color.set_sensitive(this._field_enable_ms_theme.active);
        this._field_enable_night.set_sensitive(this._field_enable_ms_theme.active);
        this._field_variant.set_sensitive(!this._field_enable_night.active & this._field_enable_ms_theme.active);
    }

    _bindValues() {
        gsettings.bind(Fields.ACTIVITIES,    this._field_activities,      'active', Gio.SettingsBindFlags.DEFAULT);
        gsettings.bind(Fields.AUTOSWITCH,    this._field_enable_ascii,    'active', Gio.SettingsBindFlags.DEFAULT);
        gsettings.bind(Fields.ENABLEHOTKEY,  this._field_enable_hotkey,   'active', Gio.SettingsBindFlags.DEFAULT);
        gsettings.bind(Fields.ENABLEMSTHEME, this._field_enable_ms_theme, 'active', Gio.SettingsBindFlags.DEFAULT);
        gsettings.bind(Fields.ENABLEORIEN,   this._field_enable_orien,    'active', Gio.SettingsBindFlags.DEFAULT);
        gsettings.bind(Fields.MSTHEMECOLOR,  this._field_theme_color,     'active', Gio.SettingsBindFlags.DEFAULT);
        gsettings.bind(Fields.MSTHEMENIGHT,  this._field_enable_night,    'active', Gio.SettingsBindFlags.DEFAULT);
        gsettings.bind(Fields.MSTHEMESTYLE,  this._field_variant,         'active', Gio.SettingsBindFlags.DEFAULT);
        gsettings.bind(Fields.ORIENTATION,   this._field_orientation,     'active', Gio.SettingsBindFlags.DEFAULT);
        gsettings.bind(Fields.UNKNOWNSTATE,  this._field_unkown_state,    'active', Gio.SettingsBindFlags.DEFAULT);
        gsettings.bind(Fields.USECUSTOMFONT, this._field_use_custom_font, 'active', Gio.SettingsBindFlags.DEFAULT);
    }

    _listFrameMaker(lbl, margin_top) {
        let frame = new Gtk.Frame({
            label_yalign: 1,
        });
        frame.set_label_widget(new Gtk.Label({
            use_markup: true,
            margin_top: margin_top ? margin_top : 0,
            label: "<b><big>" + lbl + "</big></b>",
        }));
        this._box.add(frame);

        frame.grid = new Gtk.Grid({
            margin: 10,
            hexpand: true,
            row_spacing: 12,
            column_spacing: 18,
            row_homogeneous: false,
            column_homogeneous: false,
        });

        frame.grid._row = 0;
        frame.add(frame.grid);
        frame._add = (x, y) => {
            const hbox = new Gtk.Box();
            hbox.pack_start(x, true, true, 4);
            if(y) hbox.pack_start(y, false, false, 4);
            frame.grid.attach(hbox, 0, frame.grid._row++, 1, 1);
        }
        return frame;
    }

    _labelMaker(x) {
        return new Gtk.Label({
            label: x,
            hexpand: true,
            halign: Gtk.Align.START,
        });
    }

    _checkMaker(x) {
        return new Gtk.CheckButton({
            label: x,
            hexpand: true,
            halign: Gtk.Align.START,
        });
    }

    _comboMaker(ops) {
        let l = new Gtk.ListStore();
        l.set_column_types([GObject.TYPE_STRING]);
        ops.forEach(op => l.set(l.append(), [0], [op]));
        let c = new Gtk.ComboBox({ model: l });
        let r = new Gtk.CellRendererText();
        c.pack_start(r, false);
        c.add_attribute(r, "text", 0);
        return c;
    }

    _shortCutMaker(hotkey) {
        let model = new Gtk.ListStore();
        model.set_column_types([GObject.TYPE_INT, GObject.TYPE_INT]);

        const row = model.insert(0);
        let [key, mods] = Gtk.accelerator_parse(gsettings.get_strv(hotkey)[0]);
        model.set(row, [0, 1], [mods, key]);

        let treeView = new Gtk.TreeView({model: model});
        treeView.set_headers_visible(false)
        let accelerator = new Gtk.CellRendererAccel({
            'editable': true,
            'accel-mode': Gtk.CellRendererAccelMode.GTK
        });

        accelerator.connect('accel-edited', (r, iter, key, mods) => {
            let value = Gtk.accelerator_name(key, mods);
            let [succ, iterator] = model.get_iter_from_string(iter);
            model.set(iterator, [0, 1], [mods, key]);
            if (key != 0) {
                gsettings.set_strv(hotkey, [value]);
            }
        });

        let column = new Gtk.TreeViewColumn({});
        column.pack_start(accelerator, false);
        column.add_attribute(accelerator, 'accel-mods', 0);
        column.add_attribute(accelerator, 'accel-key', 1);
        treeView.append_column(column);

        return treeView;
    }
});

