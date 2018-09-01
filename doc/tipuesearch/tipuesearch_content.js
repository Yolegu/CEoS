var tipuesearch = {"pages":[{"title":" Fortran Program ","text":"Fortran Program","tags":"","loc":"index.html"},{"title":"constants_mod.f90 – Fortran Program","text":"Modules constants_mod Source Code constants_mod.f90 Source Code module constants_mod real ( 8 ), parameter :: rgp = 8.314417 real ( 8 ), parameter :: pi = 4.d0 * atan ( 1.d0 ) end module","tags":"","loc":"sourcefile/constants_mod.f90.html"},{"title":"gnuplot_mod.f90 – Fortran Program","text":"Modules gnuplot_mod Source Code gnuplot_mod.f90 Source Code module gnuplot_mod implicit none private character ( 20 ), parameter :: instruction_file = \"instructions.gnu\" type , public :: serie_type real ( 8 ), allocatable :: x (:) real ( 8 ), allocatable :: y (:) contains procedure :: init => init_serie end type public :: plot contains subroutine init_serie ( self , x , y ) class ( serie_type ) :: self real ( 8 ) :: x (:), y (:) allocate ( self % x ( size ( x ))) allocate ( self % y ( size ( y ))) self % x = x self % y = y end subroutine subroutine plot ( serie , xlabel , ylabel ) type ( serie_type ), intent ( in ) :: serie (:) character ( * ) :: xlabel , ylabel integer :: i , j open ( 20 , file = 'data.gnu' ) do j = 1 , size ( serie ) do i = 1 , size ( serie ( j )% x ) write ( 20 , * ) serie ( j )% x ( i ), serie ( j )% y ( i ) end do write ( 20 , * ) write ( 20 , * ) end do call write_header () open ( 30 , file = instruction_file , position = 'append' ) write ( 30 , * ) \"set xlabel '\" // trim ( xlabel ) // \"'\" write ( 30 , * ) \"set ylabel '\" // trim ( ylabel ) // \"'\" write ( 30 , * ) \"plot 'data.gnu' using 1:2 with lines\" close ( 30 ) call execute_command_line ( 'gnuplot -p ' // trim ( instruction_file )) close ( 20 ) end subroutine subroutine write_header () open ( 30 , file = instruction_file ) write ( 30 , * ) \"set terminal wxt size 800, 600\" write ( 30 , * ) \"set key off\" write ( 30 , * ) \"set xtics font 'Consolas,10'\" write ( 30 , * ) \"set ytics font 'Consolas,10'\" close ( 30 ) end subroutine end module","tags":"","loc":"sourcefile/gnuplot_mod.f90.html"},{"title":"main.f90 – Fortran Program","text":"Programs ceos Subroutines read_options Source Code main.f90 Source Code program ceos use pure_mod use math_mod use gnuplot_mod implicit none type ( pure_type ) :: pure integer :: eos_id , alpha_id real ( 8 ) :: tc , pc , acen real ( 8 ) :: v ( 3 ) integer :: n call read_options ( eos_id , tc , pc , acen , alpha_id ) call pure % init ( eos_id , tc , pc , acen , alpha_id ) call pure % solve_eos ( 14 0.d0 , 0.5d0 * pure % pc , v , n ) call pure % show_isotherm ([ 12 0.d0 , 13 0.d0 , 14 0.d0 ]) end program subroutine read_options ( eos_id , tc , pc , acen , alpha_id ) implicit none integer , intent ( out ) :: eos_id real ( 8 ), intent ( out ) :: tc real ( 8 ), intent ( out ) :: pc real ( 8 ), intent ( out ) :: acen integer , intent ( out ) :: alpha_id open ( 20 , file = 'options.txt' , status = 'old' ) read ( 20 , * ) read ( 20 , * ) eos_id read ( 20 , * ) read ( 20 , * ) tc read ( 20 , * ) read ( 20 , * ) pc pc = pc * 1.d5 read ( 20 , * ) read ( 20 , * ) acen read ( 20 , * ) read ( 20 , * ) alpha_id close ( 20 ) end subroutine","tags":"","loc":"sourcefile/main.f90.html"},{"title":"math_mod.f90 – Fortran Program","text":"Modules math_mod Source Code math_mod.f90 Source Code module math_mod use iso_fortran_env use constants_mod implicit none contains subroutine set_cubic_monic ( coeff , coeff_monic ) real ( 8 ), intent ( in ) :: coeff (:) real ( 8 ), intent ( out ) :: coeff_monic ( size ( coeff )) coeff_monic = coeff / coeff ( size ( coeff )) end subroutine subroutine cardan ( coeff , x , n ) real ( 8 ), intent ( in ) :: coeff ( 4 ) real ( 8 ), intent ( out ) :: x ( 3 ) integer , intent ( out ) :: n real ( 8 ) :: a , b , c , d real ( 8 ) :: q , r , delta , s , t , theta a = coeff ( 4 ) b = coeff ( 3 ) c = coeff ( 2 ) d = coeff ( 1 ) q = ( 3.d0 * c - b ** 2 ) / 9.d0 r = ( 9.d0 * b * c - 2 7.d0 * d - 2.d0 * b ** 3 ) / 5 4.d0 delta = q ** 3 + r ** 2 if ( delta > 0.d0 ) then s = cbrt ( r + sqrt ( delta )) t = cbrt ( r - sqrt ( delta )) x ( 1 ) = s + t - b / 3.d0 x ( 2 : 3 ) = 0.d0 n = 1 else theta = acos ( r / sqrt ( - q ** 3 )) x ( 1 ) = 2.d0 * sqrt ( - q ) * cos ( theta / 3.d0 ) - b / 3.d0 x ( 2 ) = 2.d0 * sqrt ( - q ) * cos ( theta / 3.d0 + 2.d0 * pi / 3.d0 ) - b / 3.d0 x ( 3 ) = 2.d0 * sqrt ( - q ) * cos ( theta / 3.d0 + 4.d0 * pi / 3.d0 ) - b / 3.d0 n = 3 end if end subroutine subroutine newton_after_cardan ( coeff , x , n ) ! Newton's method applied to the result of Cardano's method ! The function is f(x) = a x&#94;3 + b x&#94;2 + c x + d ! Function's derivative is f'(x) = 3a x&#94;2 + 2b x + c real ( 8 ), intent ( in ) :: coeff ( 4 ) real ( 8 ), intent ( inout ) :: x ( 3 ) integer , intent ( in ) :: n real ( 8 ) :: f real ( 8 ) :: dfdx integer :: i real ( 8 ) :: a , b , c , d real ( 8 ), parameter :: eps = 1.d-15 a = coeff ( 4 ) b = coeff ( 3 ) c = coeff ( 2 ) d = coeff ( 1 ) do i = 1 , n f = x ( i ) ** 3 + b * x ( i ) ** 2 + c * x ( i ) + d if ( f > eps ) then dfdx = 3.d0 * x ( i ) ** 2 + 2.d0 * b * x ( i ) + c x ( i ) = x ( i ) - f / dfdx else cycle end if end do end subroutine subroutine swap ( x , a , b ) real ( 8 ) :: x (:) integer , intent ( in ) :: a , b real ( 8 ) :: temp temp = x ( a ) x ( a ) = x ( b ) x ( b ) = temp end subroutine subroutine sort_cardan_roots ( x ) ! Sort the three roots in decreasing order ! src: https://stackoverflow.com/questions/4793251/sorting-int-array-with-only-3-elements real ( 8 ), intent ( inout ) :: x ( 3 ) real ( 8 ) :: temp if ( x ( 1 ) < x ( 2 )) then call swap ( x , 1 , 2 ) end if if ( x ( 2 ) < x ( 3 )) then call swap ( x , 2 , 3 ) end if if ( x ( 1 ) < x ( 2 )) then call swap ( x , 1 , 2 ) end if end subroutine subroutine solve_cubic_polynomial ( coeff , x , n ) real ( 8 ), intent ( in ) :: coeff ( 4 ) real ( 8 ) :: coeff_monic ( 4 ) real ( 8 ), intent ( out ) :: x ( 3 ) integer :: n call set_cubic_monic ( coeff , coeff_monic ) call cardan ( coeff_monic , x , n ) call newton_after_cardan ( coeff_monic , x , n ) if ( n == 3 ) then call sort_cardan_roots ( x ) end if end subroutine subroutine test_cardan () real ( 8 ) :: x ( 3 ) integer :: n write ( * , * ) 'Solve x&#94;3 + 6 x&#94;2 + 11 x + 6 = 0' write ( * , * ) 'Answer: x(1) = -2' write ( * , * ) 'Answer: x(2) = -1' write ( * , * ) 'Answer: x(3) = -3' call solve_cubic_polynomial ([ 6.d0 , 1 1.d0 , 6.d0 , 1.d0 ], x , n ) write ( * , * ) 'x_cardan = ' , x write ( * , * ) write ( * , * ) 'Solve 1000 x&#94;3 - 1254 x&#94;2 - 496 x + 191 = 0' write ( * , * ) 'Answer: x(1) = 1.4997993055' write ( * , * ) 'Answer: x(2) = -0.5003313644' write ( * , * ) 'Answer: x(3) = 0.254532059' call solve_cubic_polynomial ([ 19 1.d0 , - 49 6.d0 , - 125 4.d0 , 100 0.d0 ], x , n ) write ( * , * ) 'x_cardan = ' , x end subroutine function cbrt ( x ) real ( 8 ), intent ( in ) :: x real ( 8 ) :: cbrt cbrt = sign ( abs ( x ) ** ( 1.d0 / 3.d0 ), x ) end function function linspace ( x_min , x_max , n_points ) result ( x_arr ) real ( 8 ), intent ( in ) :: x_min real ( 8 ), intent ( in ) :: x_max integer , intent ( in ) :: n_points real ( 8 ) :: x_arr ( n_points ) real ( 8 ) :: x_step integer :: i x_step = ( x_max - x_min ) / float ( n_points - 1 ) do i = 1 , n_points x_arr ( i ) = x_min + ( i - 1 ) * x_step end do end function end module","tags":"","loc":"sourcefile/math_mod.f90.html"},{"title":"pure_mod.f90 – Fortran Program","text":"Modules pure_mod Source Code pure_mod.f90 Source Code module pure_mod use constants_mod use math_mod use gnuplot_mod implicit none private type , public :: pure_type real ( 8 ) :: r1 !! ceos universal constant real ( 8 ) :: r2 real ( 8 ) :: tc real ( 8 ) :: pc real ( 8 ) :: acen real ( 8 ) :: ac real ( 8 ) :: bc real ( 8 ) :: zc real ( 8 ) :: vc procedure ( alpha_int ), pointer :: alpha , dalpha_dtr , d2alpha_dtr2 real ( 8 ) :: m_soave contains procedure :: init procedure :: a , da_dt , d2a_dt2 procedure :: p , dp_dt , dp_dv procedure :: solve_eos procedure :: show_isotherm procedure :: m_soave_rk , m_soave_pr end type abstract interface function alpha_int ( self , tr ) import pure_type class ( pure_type ) :: self real ( 8 ), intent ( in ) :: tr real ( 8 ) :: alpha_int end function end interface contains subroutine init ( self , eos_id , tc , pc , acen , alpha_id ) class ( pure_type ) :: self integer , intent ( in ) :: eos_id real ( 8 ), intent ( in ) :: tc real ( 8 ), intent ( in ) :: pc real ( 8 ), intent ( in ) :: acen integer , intent ( in ) :: alpha_id real ( 8 ) :: r1 real ( 8 ) :: r2 real ( 8 ) :: etac real ( 8 ) :: omegaa real ( 8 ) :: omegab if ( eos_id == 0 ) then r1 = 0.d0 r2 = 0.d0 elseif ( eos_id == 1 ) then r1 = - 1.d0 r2 = 0.d0 elseif ( eos_id == 2 ) then r1 = - 1.d0 - sqrt ( 2.d0 ) r2 = - 1.d0 + sqrt ( 2.d0 ) end if self % r1 = r1 self % r2 = r2 self % tc = tc self % pc = pc self % acen = acen etac = 1.d0 / ((( 1.d0 - r1 ) * ( 1.d0 - r2 )) ** ( 1.d0 / 3.d0 ) & & + (( 1.d0 - r2 ) * ( 1.d0 - r1 )) ** ( 1.d0 / 3.d0 ) + 1.d0 ) omegaa = ( 1.d0 - etac * r1 ) * ( 1.d0 - etac * r2 ) * ( 2.d0 - etac * ( r1 + r2 )) / & & (( 1.d0 - etac ) * ( 3.d0 - etac * ( 1.d0 + r1 + r2 )) ** 2 ) self % ac = omegaa * ( rgp * tc ) ** 2 / pc omegab = etac / ( 3.d0 - etac * ( 1.d0 + r1 + r2 )) self % bc = omegab * rgp * tc / pc self % vc = self % bc / etac self % zc = omegab / etac if ( alpha_id == 0 ) then self % alpha => alpha_one self % dalpha_dtr => dalpha_one_dtr self % d2alpha_dtr2 => d2alpha_one_dtr2 elseif ( alpha_id == 1 ) then if ( eos_id == 1 ) then self % m_soave = self % m_soave_rk () elseif ( eos_id == 2 ) then self % m_soave = self % m_soave_rk () else stop 'No Soave function for this equation of state' end if self % alpha => alpha_soave self % dalpha_dtr => dalpha_soave_dtr self % d2alpha_dtr2 => d2alpha_soave_dtr2 else stop 'The selected alpha function does not exists' end if end subroutine function p ( self , t , v ) class ( pure_type ) :: self real ( 8 ), intent ( in ) :: t real ( 8 ), intent ( in ) :: v real ( 8 ) :: p p = rgp * t / ( v - self % bc ) - self % a ( t ) / (( v - self % r1 * self % bc ) * ( v - self % r2 * self % bc )) end function function alpha_one ( self , tr ) class ( pure_type ) :: self real ( 8 ), intent ( in ) :: tr real ( 8 ) :: alpha_one alpha_one = 1.d0 end function function dalpha_one_dtr ( self , tr ) result ( dalpha_dtr ) class ( pure_type ) :: self real ( 8 ), intent ( in ) :: tr real ( 8 ) :: dalpha_dtr dalpha_dtr = 0.d0 end function function d2alpha_one_dtr2 ( self , tr ) result ( d2alpha_dtr2 ) class ( pure_type ) :: self real ( 8 ), intent ( in ) :: tr real ( 8 ) :: d2alpha_dtr2 d2alpha_dtr2 = 0.d0 end function function m_soave_rk ( self ) result ( m ) class ( pure_type ) :: self real ( 8 ) :: m m = 0.480d0 + 1.574d0 * self % acen - 0.176d0 * self % acen ** 2 end function function m_soave_pr ( self ) result ( m ) class ( pure_type ) :: self real ( 8 ) :: m m = 0.37464d0 + 1.54226d0 * self % acen - 0.26992d0 * self % acen ** 2 end function function alpha_soave ( self , tr ) result ( alpha ) class ( pure_type ) :: self real ( 8 ) :: alpha real ( 8 ), intent ( in ) :: tr alpha = ( 1.d0 + self % m_soave * ( 1.d0 - sqrt ( tr ))) ** 2 end function function dalpha_soave_dtr ( self , tr ) result ( dalpha_dtr ) class ( pure_type ) :: self real ( 8 ), intent ( in ) :: tr real ( 8 ) :: dalpha_dtr dalpha_dtr = - self % m_soave * ( 1.d0 - self % m_soave * ( sqrt ( tr ) - 1.d0 )) / sqrt ( tr ) end function function d2alpha_soave_dtr2 ( self , tr ) result ( d2alpha_dtr2 ) class ( pure_type ) :: self real ( 8 ), intent ( in ) :: tr real ( 8 ) :: d2alpha_dtr2 d2alpha_dtr2 = - self % m_soave * ( self % m_soave + 1.d0 ) / ( 2.d0 * tr ** ( 3.d0 / 2.d0 )) end function function a ( self , t ) class ( pure_type ) :: self real ( 8 ) :: a real ( 8 ) :: t a = self % ac * self % alpha ( t / self % tc ) end function function da_dt ( self , t ) class ( pure_type ) :: self real ( 8 ) :: da_dt real ( 8 ) :: t da_dt = self % ac / self % tc * self % dalpha_dtr ( t / self % tc ) end function function d2a_dt2 ( self , t ) class ( pure_type ) :: self real ( 8 ) :: d2a_dt2 real ( 8 ) :: t d2a_dt2 = self % ac / self % tc ** 2 * self % d2alpha_dtr2 ( t / self % tc ) end function function dp_dt ( self , t , v ) class ( pure_type ) :: self real ( 8 ) :: dp_dt real ( 8 ), intent ( in ) :: t , v dp_dt = rgp / ( v - self % bc ) - self % da_dt ( t ) / & & (( v - self % r1 * self % bc ) * ( v - self % r2 * self % bc )) end function function dp_dv ( self , t , v ) class ( pure_type ) :: self real ( 8 ) :: dp_dv real ( 8 ), intent ( in ) :: t , v dp_dv = - rgp * t / ( v - self % bc ) ** 2 & & + self % a ( t ) * ( 2.d0 * v - ( self % r1 + self % r2 ) * self % bc ) & & / (( v - self % bc * self % r1 ) * ( v - self % bc * self % r2 )) ** 2 end function subroutine solve_eos ( self , t , p , v , n ) class ( pure_type ) :: self real ( 8 ), intent ( in ) :: t real ( 8 ), intent ( in ) :: p real ( 8 ), intent ( out ) :: v ( 3 ) integer , intent ( out ) :: n real ( 8 ) :: a , b , c , d real ( 8 ) :: coeff ( 4 ) a = 1.d0 b = - ( self % bc * ( self % r1 + self % r2 + 1.d0 ) + rgp * t / p ) c = self % bc ** 2 * ( self % r1 * self % r2 + self % r1 + self % r2 ) & & + rgp * t * self % bc * ( self % r1 + self % r2 ) / p & & + self % a ( t ) / p d = - self % bc * ( self % r1 * self % r2 * self % bc ** 2 & & + self % r1 * self % r2 * self % bc * rgp * t / p + self % a ( t ) / p ) coeff ( 1 ) = d coeff ( 2 ) = c coeff ( 3 ) = b coeff ( 4 ) = a call solve_cubic_polynomial ( coeff , v , n ) end subroutine subroutine show_isotherm ( self , t ) class ( pure_type ) :: self integer , parameter :: n_points = 1000 real ( 8 ), intent ( in ) :: t (:) real ( 8 ) :: p_arr ( n_points ), v_arr ( n_points ) integer :: i , j type ( serie_type ), allocatable :: serie (:) allocate ( serie ( size ( t ))) do j = 1 , size ( t ) v_arr = linspace ( 1.01d0 * self % bc , 5 0.d0 * self % bc , n_points ) do i = 1 , n_points p_arr ( i ) = self % p ( t ( j ), v_arr ( i )) if ( p_arr ( i ) < 2.d0 * self % pc ) then v_arr = linspace ( v_arr ( i ), 5 0.d0 * self % bc , n_points ) exit end if end do do i = 1 , n_points p_arr ( i ) = self % p ( t ( j ), v_arr ( i )) end do call serie ( j )% init ( v_arr * 1.d6 , p_arr * 1.d-5 ) end do call plot ( serie , \"v / [cm&#94;3.mol&#94;{-1}]\" , \"p / bar\" ) end subroutine end module","tags":"","loc":"sourcefile/pure_mod.f90.html"},{"title":"serie_type – Fortran Program ","text":"type, public :: serie_type Variables x y Type-Bound Procedures init Components Type Visibility Attributes Name Initial real(kind=8), public, allocatable :: x (:) real(kind=8), public, allocatable :: y (:) Type-Bound Procedures procedure, public :: init => init_serie private subroutine init_serie(self, x, y) Arguments Type Intent Optional Attributes Name class( serie_type ) :: self real(kind=8) :: x (:) real(kind=8) :: y (:)","tags":"","loc":"type/serie_type.html"},{"title":"pure_type – Fortran Program ","text":"type, public :: pure_type Variables r1 r2 tc pc acen ac bc zc vc alpha dalpha_dtr d2alpha_dtr2 m_soave Type-Bound Procedures init d2a_dt2 da_dt a dp_dv dp_dt p solve_eos show_isotherm m_soave_pr m_soave_rk Components Type Visibility Attributes Name Initial real(kind=8), public :: r1 ceos universal constant real(kind=8), public :: r2 real(kind=8), public :: tc real(kind=8), public :: pc real(kind=8), public :: acen real(kind=8), public :: ac real(kind=8), public :: bc real(kind=8), public :: zc real(kind=8), public :: vc procedure(alpha_int), public, pointer :: alpha procedure(alpha_int), public, pointer :: dalpha_dtr procedure(alpha_int), public, pointer :: d2alpha_dtr2 real(kind=8), public :: m_soave Type-Bound Procedures procedure, public :: init private subroutine init(self, eos_id, tc, pc, acen, alpha_id) Arguments Type Intent Optional Attributes Name class( pure_type ) :: self integer, intent(in) :: eos_id real(kind=8), intent(in) :: tc real(kind=8), intent(in) :: pc real(kind=8), intent(in) :: acen integer, intent(in) :: alpha_id procedure, public :: d2a_dt2 private function d2a_dt2(self, t) Arguments Type Intent Optional Attributes Name class( pure_type ) :: self real(kind=8) :: t Return Value real(kind=8) procedure, public :: da_dt private function da_dt(self, t) Arguments Type Intent Optional Attributes Name class( pure_type ) :: self real(kind=8) :: t Return Value real(kind=8) procedure, public :: a private function a(self, t) Arguments Type Intent Optional Attributes Name class( pure_type ) :: self real(kind=8) :: t Return Value real(kind=8) procedure, public :: dp_dv private function dp_dv(self, t, v) Arguments Type Intent Optional Attributes Name class( pure_type ) :: self real(kind=8), intent(in) :: t real(kind=8), intent(in) :: v Return Value real(kind=8) procedure, public :: dp_dt private function dp_dt(self, t, v) Arguments Type Intent Optional Attributes Name class( pure_type ) :: self real(kind=8), intent(in) :: t real(kind=8), intent(in) :: v Return Value real(kind=8) procedure, public :: p private function p(self, t, v) Arguments Type Intent Optional Attributes Name class( pure_type ) :: self real(kind=8), intent(in) :: t real(kind=8), intent(in) :: v Return Value real(kind=8) procedure, public :: solve_eos private subroutine solve_eos(self, t, p, v, n) Arguments Type Intent Optional Attributes Name class( pure_type ) :: self real(kind=8), intent(in) :: t real(kind=8), intent(in) :: p real(kind=8), intent(out) :: v (3) integer, intent(out) :: n procedure, public :: show_isotherm private subroutine show_isotherm(self, t) Arguments Type Intent Optional Attributes Name class( pure_type ) :: self real(kind=8), intent(in) :: t (:) procedure, public :: m_soave_pr private function m_soave_pr(self) result(m) Arguments Type Intent Optional Attributes Name class( pure_type ) :: self Return Value real(kind=8) procedure, public :: m_soave_rk private function m_soave_rk(self) result(m) Arguments Type Intent Optional Attributes Name class( pure_type ) :: self Return Value real(kind=8)","tags":"","loc":"type/pure_type.html"},{"title":"read_options – Fortran Program","text":"subroutine read_options(eos_id, tc, pc, acen, alpha_id) Arguments Type Intent Optional Attributes Name integer, intent(out) :: eos_id real(kind=8), intent(out) :: tc real(kind=8), intent(out) :: pc real(kind=8), intent(out) :: acen integer, intent(out) :: alpha_id","tags":"","loc":"proc/read_options.html"},{"title":"plot – Fortran Program","text":"public subroutine plot(serie, xlabel, ylabel) Arguments Type Intent Optional Attributes Name type( serie_type ), intent(in) :: serie (:) character(len=*) :: xlabel character(len=*) :: ylabel","tags":"","loc":"proc/plot.html"},{"title":"cbrt – Fortran Program","text":"public function cbrt(x) Arguments Type Intent Optional Attributes Name real(kind=8), intent(in) :: x Return Value real(kind=8)","tags":"","loc":"proc/cbrt.html"},{"title":"linspace – Fortran Program","text":"public function linspace(x_min, x_max, n_points) result(x_arr) Arguments Type Intent Optional Attributes Name real(kind=8), intent(in) :: x_min real(kind=8), intent(in) :: x_max integer, intent(in) :: n_points Return Value real(kind=8)\n  (n_points)","tags":"","loc":"proc/linspace.html"},{"title":"set_cubic_monic – Fortran Program","text":"public subroutine set_cubic_monic(coeff, coeff_monic) Arguments Type Intent Optional Attributes Name real(kind=8), intent(in) :: coeff (:) real(kind=8), intent(out) :: coeff_monic (size(coeff))","tags":"","loc":"proc/set_cubic_monic.html"},{"title":"cardan – Fortran Program","text":"public subroutine cardan(coeff, x, n) Arguments Type Intent Optional Attributes Name real(kind=8), intent(in) :: coeff (4) real(kind=8), intent(out) :: x (3) integer, intent(out) :: n","tags":"","loc":"proc/cardan.html"},{"title":"newton_after_cardan – Fortran Program","text":"public subroutine newton_after_cardan(coeff, x, n) Arguments Type Intent Optional Attributes Name real(kind=8), intent(in) :: coeff (4) real(kind=8), intent(inout) :: x (3) integer, intent(in) :: n","tags":"","loc":"proc/newton_after_cardan.html"},{"title":"swap – Fortran Program","text":"public subroutine swap(x, a, b) Arguments Type Intent Optional Attributes Name real(kind=8) :: x (:) integer, intent(in) :: a integer, intent(in) :: b","tags":"","loc":"proc/swap.html"},{"title":"sort_cardan_roots – Fortran Program","text":"public subroutine sort_cardan_roots(x) Arguments Type Intent Optional Attributes Name real(kind=8), intent(inout) :: x (3)","tags":"","loc":"proc/sort_cardan_roots.html"},{"title":"solve_cubic_polynomial – Fortran Program","text":"public subroutine solve_cubic_polynomial(coeff, x, n) Arguments Type Intent Optional Attributes Name real(kind=8), intent(in) :: coeff (4) real(kind=8), intent(out) :: x (3) integer :: n","tags":"","loc":"proc/solve_cubic_polynomial.html"},{"title":"test_cardan – Fortran Program","text":"public subroutine test_cardan() Arguments None","tags":"","loc":"proc/test_cardan.html"},{"title":"constants_mod – Fortran Program","text":"Variables rgp pi Variables Type Visibility Attributes Name Initial real(kind=8), public, parameter :: rgp = 8.314417 real(kind=8), public, parameter :: pi = 4.d0*atan(1.d0)","tags":"","loc":"module/constants_mod.html"},{"title":"gnuplot_mod – Fortran Program","text":"Derived Types serie_type Subroutines plot Derived Types type, public :: serie_type Components Type Visibility Attributes Name Initial real(kind=8), public, allocatable :: x (:) real(kind=8), public, allocatable :: y (:) Type-Bound Procedures procedure, public :: init => init_serie Subroutines public subroutine plot (serie, xlabel, ylabel) Arguments Type Intent Optional Attributes Name type( serie_type ), intent(in) :: serie (:) character(len=*) :: xlabel character(len=*) :: ylabel","tags":"","loc":"module/gnuplot_mod.html"},{"title":"math_mod – Fortran Program","text":"Uses: iso_fortran_env constants_mod Functions cbrt linspace Subroutines set_cubic_monic cardan newton_after_cardan swap sort_cardan_roots solve_cubic_polynomial test_cardan Functions public function cbrt (x) Arguments Type Intent Optional Attributes Name real(kind=8), intent(in) :: x Return Value real(kind=8) public function linspace (x_min, x_max, n_points) result(x_arr) Arguments Type Intent Optional Attributes Name real(kind=8), intent(in) :: x_min real(kind=8), intent(in) :: x_max integer, intent(in) :: n_points Return Value real(kind=8)\n  (n_points) Subroutines public subroutine set_cubic_monic (coeff, coeff_monic) Arguments Type Intent Optional Attributes Name real(kind=8), intent(in) :: coeff (:) real(kind=8), intent(out) :: coeff_monic (size(coeff)) public subroutine cardan (coeff, x, n) Arguments Type Intent Optional Attributes Name real(kind=8), intent(in) :: coeff (4) real(kind=8), intent(out) :: x (3) integer, intent(out) :: n public subroutine newton_after_cardan (coeff, x, n) Arguments Type Intent Optional Attributes Name real(kind=8), intent(in) :: coeff (4) real(kind=8), intent(inout) :: x (3) integer, intent(in) :: n public subroutine swap (x, a, b) Arguments Type Intent Optional Attributes Name real(kind=8) :: x (:) integer, intent(in) :: a integer, intent(in) :: b public subroutine sort_cardan_roots (x) Arguments Type Intent Optional Attributes Name real(kind=8), intent(inout) :: x (3) public subroutine solve_cubic_polynomial (coeff, x, n) Arguments Type Intent Optional Attributes Name real(kind=8), intent(in) :: coeff (4) real(kind=8), intent(out) :: x (3) integer :: n public subroutine test_cardan () Arguments None","tags":"","loc":"module/math_mod.html"},{"title":"pure_mod – Fortran Program","text":"Uses: constants_mod math_mod gnuplot_mod Derived Types pure_type Derived Types type, public :: pure_type Components Type Visibility Attributes Name Initial real(kind=8), public :: r1 ceos universal constant real(kind=8), public :: r2 real(kind=8), public :: tc real(kind=8), public :: pc real(kind=8), public :: acen real(kind=8), public :: ac real(kind=8), public :: bc real(kind=8), public :: zc real(kind=8), public :: vc procedure(alpha_int), public, pointer :: alpha procedure(alpha_int), public, pointer :: dalpha_dtr procedure(alpha_int), public, pointer :: d2alpha_dtr2 real(kind=8), public :: m_soave Type-Bound Procedures procedure, public :: init procedure, public :: d2a_dt2 procedure, public :: da_dt procedure, public :: a procedure, public :: dp_dv procedure, public :: dp_dt procedure, public :: p procedure, public :: solve_eos procedure, public :: show_isotherm procedure, public :: m_soave_pr procedure, public :: m_soave_rk","tags":"","loc":"module/pure_mod.html"},{"title":"ceos – Fortran Program","text":"Uses: pure_mod math_mod gnuplot_mod Variables pure eos_id alpha_id tc pc acen v n Variables Type Attributes Name Initial type( pure_type ) :: pure integer :: eos_id integer :: alpha_id real(kind=8) :: tc real(kind=8) :: pc real(kind=8) :: acen real(kind=8) :: v (3) integer :: n","tags":"","loc":"program/ceos.html"}]}