const langMsg = `
Интерфейс тілін таңдаңыз. 
------------------------------- 
Выберите язык интерфейса. 
`;

module.exports = {
	city: 'Выберите город',
	lang: langMsg,
	ru: {
		welcome: 'Добро пожаловать!',
		reminder: {
			initial: {
				msg: 'Выберите сколько раз в день Вам должно приходить напоминание',
				actions: {
					oneTime: '1 раз в день',
				},
			},
			whatTime: {
				msg: 'Напишите, во сколько Вам прислать напоминание. Например 9:00',
			},
			notification: {
        msg: 'Напоминаем о необходимости приема лекарства.'
      },
      delete: {
        msg: 'У вас уже установлено напоминание. Хотите удалить?',
        actions: {
          create: 'Создать новое',
          delete: 'Удалить текущее',
        }
      },
      deletedSuccesfully: {
        msg: 'Напоминание успешно удалено',
      }
		}
	},
	kz: {
		welcome: 'Онлайн кеңесшісіне қош келдіңіз!',
		reminder: {
			initial: {
				msg: 'Еске салғышты күніне қанша рет алу керектігін таңдаңыз',
				actions: {
					oneTime: 'Күніне бір рет',
				},
			},
			whatTime: {
				msg: 'Сізге еске салғышты қай уақытта жіберу керектігін жазыңыз. Мысалы 9:00',
			},
      notification: {
        msg: 'Сізге дәрі қабылдауды еске саламыз.'
      },
		}
	},
	helpChat: 'https://t.me/+8Rxw2rnY3p40OTBi',
	consultantContact: 'https://t.me/ZhomartZhandos',
	psyhoContact: 'https://t.me/LudmilaPsihologAlmaty',
};