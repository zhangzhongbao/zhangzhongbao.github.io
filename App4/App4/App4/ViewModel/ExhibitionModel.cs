using SQLiteCommon;
using SQLiteCommon.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Forms;

namespace App4.ViewModel
{
    public class ExhibitionModel: ObservableObject
    {
        public ExhibitionModel()
        {
            Content= DependencyService.Get<SQLiteCommon.IDatabaseConnection>().GetHttpClient("https://zhangzhongbao.github.io/Web/Web/json/Data.json");
            
        }
        private int _ID;
        string _Text = string.Empty;
        string _Content;
        public string Text
        {
            get { return _Text; }
            set { SetProperty(ref _Text, value); }
        }

        public int ID { get => _ID; set => SetProperty(ref _ID, value); }
        public string Content { get => _Content; set => SetProperty(ref _Content, value); }
    }
}
