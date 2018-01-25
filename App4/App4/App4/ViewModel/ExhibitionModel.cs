using SQLiteCommon.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App4.ViewModel
{
    public class ExhibitionModel: ObservableObject
    {
        public ExhibitionModel()
        {
        }
        private int _ID;
        string _Text = string.Empty;
        public string Text
        {
            get { return _Text; }
            set { SetProperty(ref _Text, value); }
        }

        public int ID { get => _ID; set => SetProperty(ref _ID, value); }
    }
}
