program ceos
    use pure_mod
    implicit none

    type(pure_type) :: pure

    call pure%init(-1.d0, 0.d0, 190.6d0, 46.1d5)

end program

