import { INavData } from '@coreui/angular';

export const adminNavItems: INavData[] =
  [
    {
      name: 'Admin Board',
      url: 'admin',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'NEW'
      }
    },
    {
      title: true,
      name: 'View'
    },
    {
      name: 'Patients',
      url: 'patients',
      icon: 'icon-pencil'
    },
    {
      name: 'Doctors',
      url: 'doctors',
      icon: 'icon-pencil'
    },
    {
      name: 'Hospitals',
      url: 'hospitals',
      icon: 'icon-pencil'
    },
    {
      title: true,
      name: 'ADD'
    },
    {
      name: 'Add Patient',
      url: 'addPatient',
      icon: 'icon-puzzle',
      /*children: [
        {
          name: 'Cards',
          url: '/base/cards',
          icon: 'icon-puzzle'
        },
        {
          name: 'Carousels',
          url: '/base/carousels',
          icon: 'icon-puzzle'
        },
        {
          name: 'Collapses',
          url: '/base/collapses',
          icon: 'icon-puzzle'
        },
        {
          name: 'Forms',
          url: '/base/forms',
          icon: 'icon-puzzle'
        },
        {
          name: 'Navbars',
          url: '/base/navbars',
          icon: 'icon-puzzle'
  
        },
        {
          name: 'Pagination',
          url: '/base/paginations',
          icon: 'icon-puzzle'
        },
        {
          name: 'Popovers',
          url: '/base/popovers',
          icon: 'icon-puzzle'
        },
        {
          name: 'Progress',
          url: '/base/progress',
          icon: 'icon-puzzle'
        },
        {
          name: 'Switches',
          url: '/base/switches',
          icon: 'icon-puzzle'
        },
        {
          name: 'Tables',
          url: '/base/tables',
          icon: 'icon-puzzle'
        },
        {
          name: 'Tabs',
          url: '/base/tabs',
          icon: 'icon-puzzle'
        },
        {
          name: 'Tooltips',
          url: '/base/tooltips',
          icon: 'icon-puzzle'
        }
      ]*/
    },
    {
      name: 'Add Doctor',
      url: 'addDoctor',
      icon: 'icon-cursor',
    },
    {
      name: 'Add Hospital',
      url: 'addHospital',
      icon: 'icon-pie-chart'
    },
  ];

export const hospitalNavItems: INavData[] =
  [
    {
      title: true,
      name: 'Your Info'
    },
    {
      name: 'Home',
      url: 'hospitalUserInfo',
      icon: 'icon-pencil'
    },
    {
      title: true,
      name: 'View'
    },
    {
      name: 'Patients',
      url: 'hospitalUserPatients',
      icon: 'icon-pencil'
    },
    {
      name: 'Doctors',
      url: 'hospitalUserDoctors',
      icon: 'icon-pencil'
    },
  ];

  export const doctorNavItems: INavData[] =
  [
    {
      title: true,
      name: 'Your Info'
    },
    {
      name: 'Home',
      url: 'doctorUserInfo',
      icon: 'icon-pencil'
    },
    {
      title: true,
      name: 'View'
    },
    {
      name: 'Patients',
      url: 'doctorUserPatients',
      icon: 'icon-pencil'
    },
    {
      name: 'Hospitals',
      url: 'doctorUserHospital',
      icon: 'icon-pencil'
    },
  ];

  export const patientNavItems: INavData[] =
  [
    {
      title: true,
      name: 'Your info'
    },
    {
      name: 'Home',
      url: 'patientUserInfo',
      icon: 'icon-pencil'
    },
    {
      title: true,
      name: 'View'
    },
    {
      name: 'Doctors',
      url: 'patientUserDoctor',
      icon: 'icon-pencil'
    },
    {
      name: 'Hospitals',
      url: 'patientUserHospital',
      icon: 'icon-pencil'
    },
  ];
