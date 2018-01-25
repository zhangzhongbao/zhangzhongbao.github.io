using SQLite;
using System;
using System.Collections.Generic;
using System.Text;

namespace SQLiteCommon.Model
{
    [Table("DItem")]
    public class DItem : ObservableObject
    {
        int id;
        [PrimaryKey, AutoIncrement]

        public int Id
        {
            get { return id; }
            set { SetProperty(ref id, value); }
        }

        string text = string.Empty;
        public string Text
        {
            get { return text; }
            set { SetProperty(ref text, value); }
        }

        string description = string.Empty;
        public string Description
        {
            get { return description; }
            set { SetProperty(ref description, value); }
        }
    }
}
