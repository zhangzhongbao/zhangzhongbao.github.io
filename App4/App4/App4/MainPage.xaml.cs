using App4.View;
using App4.ViewModel;
using SQLiteCommon.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Forms;

namespace App4
{
    public partial class MainPage : ContentPage
    {
        public MainPage()
        {
            InitializeComponent();
            NavigationPage.SetHasNavigationBar(this, false);
            this.BindingContext = new MainViewModel();
        }
        async void OnExhibition(object sender, EventArgs e)
        {
            //var MainPage =new NavigationPage( new View.ExhibitionPage());

          
        }
        async void OnCall(object sender, EventArgs e)
        {
            if (await this.DisplayAlert(
                    "添加项",
                    "你确定是否添加？ ",
                    "确定",
                    "取消"))
            {
                MainViewModel model= this.BindingContext as MainViewModel;
                model.InsertDataCmd.Execute("");
                model.Data = (from cust in model.database.Table<DItem>()
                        select cust).ToList<DItem>();
            }
        }
        public async void OnTranslate(object sender, EventArgs e)
        {

            //await Navigation.PushAsync(new );
        }

        private async void ItemsListView_ItemSelected(object sender, SelectedItemChangedEventArgs e)
        {
            DItem item= e.SelectedItem as DItem;
            if (item != null)
            {
                ExhibitionPage ehp = new View.ExhibitionPage();
                MessagingCenter.Send<ExhibitionPage, DItem>(ehp, "Value", item);
                await Navigation.PushAsync(ehp);
            }
        }
    }
}
