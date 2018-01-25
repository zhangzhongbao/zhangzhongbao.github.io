using App4.ViewModel;
using SQLiteCommon.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace App4.View
{
	//[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class ExhibitionPage : ContentPage
    {
		public ExhibitionPage ()
		{
			InitializeComponent();
            this.BindingContext = new ExhibitionModel();
            NavigationPage.SetHasNavigationBar(this, false);
            MessagingCenter.Subscribe<ExhibitionPage, DItem>(this, "Value", (arg1,arg2) => {
                if (arg2 != null)
                {
                    ExhibitionModel model = this.BindingContext as ExhibitionModel;
                    model.ID = arg2.Id;
                    model.Text = arg2.Text;
                    

                }
            });
        }
        
        
    }
}